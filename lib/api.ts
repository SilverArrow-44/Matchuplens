import type { GameDetail, GameSummary, Sport, SportId } from "./types";
import { GAMES, SPORTS, FEATURED_GAME_ID } from "./sampleData";
import { fetchLiveGames, fetchSeasonStatus, parseEventId } from "./espn";

// ----------------------------------------------------------------------------
// Data access layer — LIVE (ESPN) with sample-data fallback.
//
// Set DATA_MODE=sample in .env.local to force sample data (useful for
// design work offline). Otherwise the site fetches live games and falls
// back to samples per-sport only if the live fetch fails entirely.
// ----------------------------------------------------------------------------

const SAMPLE_MODE = process.env.DATA_MODE === "sample";

const FEATURE_PRIORITY: SportId[] = [
  "worldcup",
  "nba",
  "nhl",
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
  // Derive inSeason from live ESPN season type (4 = offseason) in parallel
  const results = await Promise.allSettled(
    SPORTS.map((s) => fetchSeasonStatus(s.id))
  );
  return SPORTS.map((s, i) => {
    const r = results[i];
    return r.status === "fulfilled" ? { ...s, inSeason: r.value } : s;
  });
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
  return results.flat();
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
  return live?.find((g) => g.id === eventId) ?? null;
}

export async function getAllGameParams(): Promise<
  { sport: string; slug: string }[]
> {
  // Used by sitemap + static generation. Live slugs included when reachable;
  // new games render on demand (dynamicParams) and revalidate every 60s.
  const games = await getTodaysGames();
  return games.map((g) => ({ sport: g.sport, slug: g.slug }));
}

export function isValidSport(s: string): s is SportId {
  return SPORTS.some((sp) => sp.id === s);
}
