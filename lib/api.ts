import type { GameDetail, GameSummary, Sport, SportId } from "./types";
import { GAMES, SPORTS, FEATURED_GAME_ID } from "./sampleData";
import { fetchGameEnrichment, fetchGamesForDate, fetchLiveGames, fetchSeasonStatus, parseEventId } from "./espn";

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

export async function getGameBySlug(
  sport: SportId,
  slug: string
): Promise<GameDetail | null> {
  // Sample games have human slugs; live games end in an ESPN event id.
  const sample = GAMES.find((g) => g.sport === sport && g.slug === slug);
  if (sample) return sample;

  const eventId = parseEventId(slug);
  if (!eventId) return null;
  const live = await liveGamesFor(sport);
  const game = live?.find((g) => g.id === eventId) ?? null;
  if (!game) return null;

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
