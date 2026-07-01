import type {
  GameDetail,
  GameSummary,
  H2H,
  Sport,
  SportId,
  TeamPageData,
  TeamRef,
} from "./types";
import { GAMES, SPORTS, FEATURED_GAME_ID } from "./sampleData";
import {
  fetchGameEnrichment,
  fetchGamesForDate,
  fetchHeadToHead,
  fetchLiveGames,
  fetchSeasonStatus,
  fetchTeamData,
  fetchTeams,
  parseEventId,
} from "./espn";

// ----------------------------------------------------------------------------
// Data access layer — LIVE (ESPN) with sample-data fallback.
//
// Set DATA_MODE=sample in .env.local to force sample data (useful for
// design work offline). Otherwise the site fetches live games and falls
// back to samples per-sport only if the live fetch fails entirely.
// ----------------------------------------------------------------------------

const SAMPLE_MODE = process.env.DATA_MODE === "sample";

// ---------------------------------------------------------------------------
// inSeason cache — ESPN season-type checks are stable for hours, not seconds.
// We cache the result for 1 hour so getSports() doesn't fire 7 ESPN calls on
// every request. Cache is per-process (survives across ISR revalidations).
// ---------------------------------------------------------------------------
let seasonCache: { sports: Sport[]; expiresAt: number } | null = null;
const SEASON_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const FEATURE_PRIORITY: SportId[] = [
  "worldcup",
  "nba",
  "wnba",
  "ncaab",
  "nhl",
  "ncaaf",
  "ufc",
  "mlb",
  "soccer",
  "nfl",
];

async function liveGamesFor(sport: SportId): Promise<GameDetail[] | null> {
  if (SAMPLE_MODE) return null;
  try {
    return await fetchLiveGames(sport);
  } catch {
    return null; // network/shape failure → caller falls back to samples
  }
}

export async function getSports(): Promise<Sport[]> {
  if (SAMPLE_MODE) return SPORTS;

  // Return cached result if still fresh
  if (seasonCache && Date.now() < seasonCache.expiresAt) {
    return seasonCache.sports;
  }

  // Fetch all sport season statuses in parallel
  const results = await Promise.allSettled(
    SPORTS.map((s) => fetchSeasonStatus(s.id))
  );
  const sports = SPORTS.map((s, i) => {
    const r = results[i];
    return r.status === "fulfilled" ? { ...s, inSeason: r.value } : s;
  });

  seasonCache = { sports, expiresAt: Date.now() + SEASON_CACHE_TTL_MS };
  return sports;
}

export async function getTodaysGames(sport?: SportId): Promise<GameSummary[]> {
  const sports = sport ? [sport] : SPORTS.map((s) => s.id);
  const results = await Promise.all(
    sports.map(async (s) => {
      const live = await liveGamesFor(s);
      if (live === null) return GAMES.filter((g) => g.sport === s); // offline fallback
      return live; // live succeeded (possibly an empty slate — that's truthful)
    })
  );

  // Safety net: drop finals/cancelled games that started on a previous ET day.
  // fetchLiveGames already queries today, but this guarantees every surface
  // (homepage, sport pages, AND the header ribbon) agrees on what "today" means.
  const todayET = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  return results.flat().filter((g) => {
    if (g.status !== "final" && g.status !== "cancelled") return true;
    const gameDay = new Date(g.startTimeUTC).toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
    return gameDay >= todayET;
  });
}

// Like getTodaysGames for one sport, but returns full GameDetail (with the
// prediction) for the daily prediction hub. Applies the same stale-final filter.
export async function getPredictionSlate(sport: SportId): Promise<GameDetail[]> {
  const live = await liveGamesFor(sport);
  const all = live ?? GAMES.filter((g) => g.sport === sport);
  const todayET = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  return all.filter((g) => {
    if (g.status !== "final" && g.status !== "cancelled") return true;
    const gameDay = new Date(g.startTimeUTC).toLocaleDateString("en-CA", {
      timeZone: "America/New_York",
    });
    return gameDay >= todayET;
  });
}

export async function getFeaturedGame(): Promise<GameDetail> {
  for (const sport of FEATURE_PRIORITY) {
    const live = await liveGamesFor(sport);
    if (live && live.length) {
      // Prefer an upcoming/live game over a finished one
      return live.find((g) => g.status !== "final") ?? live[0];
    }
  }
  return GAMES.find((g) => g.id === FEATURED_GAME_ID) ?? GAMES[0];
}

/**
 * Find a completed game by ESPN event id across the last `days` days.
 * Used to resolve game pages linked from "Recent Results" — those games are
 * no longer in today's scoreboard, so we look them up by date. Each date is
 * cached by ISR, so repeat visits are cheap.
 */
async function findGameByIdInWindow(
  sport: SportId,
  eventId: string,
  back = 8,
  fwd = 8
): Promise<GameDetail | null> {
  if (SAMPLE_MODE) return null;
  const dates: string[] = [];
  for (let i = -fwd; i <= back; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(
      d.getFullYear().toString() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0")
    );
  }
  // finalsOnly=false so near-future scheduled games (e.g. a team's next game
  // linked from an evergreen page) also resolve.
  const results = await Promise.allSettled(
    dates.map((dt) => fetchGamesForDate(sport, dt, false))
  );
  for (const r of results) {
    if (r.status === "fulfilled") {
      const found = r.value.find((g) => g.id === eventId);
      if (found) return found;
    }
  }
  return null;
}

export async function getGameBySlug(
  sport: SportId,
  slug: string,
  opts: { enrich?: boolean } = {}
): Promise<GameDetail | null> {
  const { enrich = true } = opts;
  // Sample games have human slugs; live games end in an ESPN event id.
  const sample = GAMES.find((g) => g.sport === sport && g.slug === slug);
  if (sample) return sample;

  const eventId = parseEventId(slug);
  if (!eventId) return null;
  const live = await liveGamesFor(sport);
  let game = live?.find((g) => g.id === eventId) ?? null;

  // Not in today's slate? It may be a past game (from "Recent Results") or a
  // near-future game (linked from a team/matchup page). Search a date window.
  if (!game) game = await findGameByIdInWindow(sport, eventId);
  if (!game) return null;

  // Callers that only need the core matchup (e.g. the OG image) can skip the
  // extra injury/H2H fetches.
  if (!enrich) return game;

  // Enrich with per-game data: injuries from /summary, H2H from team schedule.
  // Runs in parallel; each falls back gracefully on failure.
  try {
    const { injuries, h2h } = await fetchGameEnrichment(
      sport,
      eventId,
      game.home,
      game.away,
      game.dateLabel
    );
    return { ...game, injuries, h2h };
  } catch {
    return game;
  }
}

/**
 * Fetch final games from the past N days for a sport.
 * Used for "Recent Results" sections and evergreen SEO pages.
 */
export async function getRecentResults(
  sport: SportId,
  days = 7
): Promise<GameSummary[]> {
  if (SAMPLE_MODE) return [];
  const dates: string[] = [];
  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(
      d.getFullYear().toString() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0")
    );
  }
  const results = await Promise.allSettled(
    dates.map((date) => fetchGamesForDate(sport, date))
  );
  return results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort(
      (a, b) =>
        new Date(b.startTimeUTC).getTime() - new Date(a.startTimeUTC).getTime()
    );
}

export async function getAllGameParams(): Promise<
  { sport: string; slug: string }[]
> {
  // Used by sitemap + static generation. Live slugs included when reachable;
  // new games render on demand (dynamicParams) and revalidate per the
  // route segment config (600s for game pages).
  const games = await getTodaysGames();
  return games.map((g) => ({ sport: g.sport, slug: g.slug }));
}

export function isValidSport(s: string): s is SportId {
  return SPORTS.some((sp) => sp.id === s);
}

// ---------------------------------------------------------------------------
// Prediction accuracy — model pick vs actual result for recently completed
// games. HONEST CAVEAT: we don't yet persist pre-game snapshots, so each pick
// here is reconstructed from currently-available data and may differ from the
// live pre-game lean. A persistent pre-game log is on the roadmap (see
// DATA_SOURCES.md). Draws (soccer) are excluded — the model estimates a
// two-outcome win probability and doesn't price the draw.
// ---------------------------------------------------------------------------
export interface AccuracyRow {
  sport: SportId;
  league: string;
  slug: string;
  ts: string;
  date: string;
  matchup: string;
  pick: string;
  pickPct: number;
  confidence: "Low" | "Medium" | "High";
  winnerAbbr: string;
  correct: boolean;
}
export interface AccuracyBucket {
  key: string;
  correct: number;
  total: number;
}
export interface AccuracyStats {
  rows: AccuracyRow[];
  overall: { correct: number; total: number };
  byLeague: AccuracyBucket[];
  byConfidence: AccuracyBucket[];
  windowDays: number;
}

function bucketBy(rows: AccuracyRow[], keyOf: (r: AccuracyRow) => string): AccuracyBucket[] {
  const map = new Map<string, AccuracyBucket>();
  for (const r of rows) {
    const key = keyOf(r);
    const b = map.get(key) ?? { key, correct: 0, total: 0 };
    b.total += 1;
    if (r.correct) b.correct += 1;
    map.set(key, b);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

// Expensive (fetches N days × all sports), so cache the computed result
// in-process for 6h independent of the page's ISR interval.
let accuracyCache: { stats: AccuracyStats; expiresAt: number } | null = null;
const ACCURACY_TTL_MS = 6 * 60 * 60 * 1000;

export async function getAccuracyStats(days = 7): Promise<AccuracyStats> {
  if (accuracyCache && Date.now() < accuracyCache.expiresAt) return accuracyCache.stats;

  const empty: AccuracyStats = {
    rows: [],
    overall: { correct: 0, total: 0 },
    byLeague: [],
    byConfidence: [],
    windowDays: days,
  };
  if (SAMPLE_MODE) return empty;

  const dates: string[] = [];
  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(
      d.getFullYear().toString() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0")
    );
  }

  const results = await Promise.allSettled(
    SPORTS.flatMap((s) => dates.map((dt) => fetchGamesForDate(s.id, dt)))
  );

  const seen = new Set<string>();
  const rows: AccuracyRow[] = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const g of r.value) {
      if (seen.has(g.id)) continue;
      const hs = g.homeScore;
      const as = g.awayScore;
      if (hs == null || as == null || hs === as) continue; // need a decisive result
      seen.add(g.id);
      const winnerAbbr = hs > as ? g.home.abbr : g.away.abbr;
      rows.push({
        sport: g.sport,
        league: g.league,
        slug: g.slug,
        ts: g.startTimeUTC,
        date: g.dateLabel,
        matchup: `${g.away.shortName} vs ${g.home.shortName}`,
        pick: g.prediction.pickTeamName,
        pickPct: Math.max(g.winProbHome, 100 - g.winProbHome),
        confidence: g.prediction.confidence,
        winnerAbbr,
        correct: g.prediction.pickAbbr === winnerAbbr,
      });
    }
  }
  rows.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  const stats: AccuracyStats = {
    rows,
    overall: { correct: rows.filter((r) => r.correct).length, total: rows.length },
    byLeague: bucketBy(rows, (r) => r.league),
    byConfidence: bucketBy(rows, (r) => r.confidence),
    windowDays: days,
  };
  accuracyCache = { stats, expiresAt: Date.now() + ACCURACY_TTL_MS };
  return stats;
}

// ---------------------------------------------------------------------------
// Evergreen team + matchup pages
// ---------------------------------------------------------------------------
const teamsCache = new Map<SportId, { teams: TeamRef[]; expiresAt: number }>();
const TEAMS_TTL_MS = 6 * 60 * 60 * 1000;

export async function getTeams(sport: SportId): Promise<TeamRef[]> {
  if (SAMPLE_MODE) return [];
  const cached = teamsCache.get(sport);
  if (cached && Date.now() < cached.expiresAt) return cached.teams;
  const teams = await fetchTeams(sport);
  if (teams.length) teamsCache.set(sport, { teams, expiresAt: Date.now() + TEAMS_TTL_MS });
  return teams;
}

function resolveTeam(teams: TeamRef[], slug: string): TeamRef | null {
  const s = slug.toLowerCase();
  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    teams.find((t) => t.slug.toLowerCase() === s) ??
    teams.find((t) => t.abbr.toLowerCase() === s) ??
    teams.find((t) => norm(t.shortName) === s) ??
    teams.find((t) => norm(t.name) === s) ??
    null
  );
}

export async function getTeam(sport: SportId, slug: string): Promise<TeamPageData | null> {
  const teams = await getTeams(sport);
  const team = resolveTeam(teams, slug);
  if (!team) return null;
  return fetchTeamData(sport, team);
}

export interface MatchupData {
  teamA: TeamRef;
  teamB: TeamRef;
  dataA: TeamPageData | null;
  dataB: TeamPageData | null;
  h2h: H2H;
  upcoming?: { slug: string; dateLabel: string; startTimeUTC: string; isHomeA: boolean };
}

export async function getMatchup(
  sport: SportId,
  aSlug: string,
  bSlug: string
): Promise<MatchupData | null> {
  const teams = await getTeams(sport);
  const teamA = resolveTeam(teams, aSlug);
  const teamB = resolveTeam(teams, bSlug);
  if (!teamA || !teamB || teamA.id === teamB.id) return null;

  const [dataA, dataB, h2h] = await Promise.all([
    fetchTeamData(sport, teamA),
    fetchTeamData(sport, teamB),
    fetchHeadToHead(sport, teamA, teamB),
  ]);

  let upcoming: MatchupData["upcoming"];
  const meeting = dataA?.upcoming.find(
    (g) => g.opponentTeamSlug === teamB.slug || g.opponentAbbr === teamB.abbr
  );
  if (meeting) {
    upcoming = {
      slug: meeting.slug,
      dateLabel: meeting.dateLabel,
      startTimeUTC: meeting.startTimeUTC,
      isHomeA: meeting.isHome,
    };
  }
  return { teamA, teamB, dataA, dataB, h2h, upcoming };
}
