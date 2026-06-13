import type {
  GameDetail,
  PlayerCard,
  SportId,
  StatComparison,
  Team,
} from "./types";
import { buildPrediction } from "./predict";

// ----------------------------------------------------------------------------
// ESPN public site API adapter.
// Endpoint: https://site.api.espn.com/apis/site/v2/sports/{path}/scoreboard
// Unofficial but free and stable for years. If ESPN changes shapes, only
// this file needs updating.
// ----------------------------------------------------------------------------

const BASE = "https://site.api.espn.com/apis/site/v2/sports";

export const LEAGUE_PATH: Record<SportId, string> = {
  nba: "basketball/nba",
  mlb: "baseball/mlb",
  nhl: "hockey/nhl",
  nfl: "football/nfl",
  ufc: "mma/ufc",
  soccer: "soccer/usa.1", // MLS
  worldcup: "soccer/fifa.world",
};

const LEAGUE_LABEL: Record<SportId, string> = {
  nba: "NBA",
  mlb: "MLB",
  nhl: "NHL",
  nfl: "NFL",
  ufc: "UFC",
  soccer: "MLS",
  worldcup: "FIFA World Cup 2026",
};

// Stats where a LOWER value is better
const LOWER_IS_BETTER = /turnover|error|against|absorbed|allowed|fouls/i;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Strip all HTML tags except <strong> and <em> from ESPN headline strings.
 * Prevents potential XSS from unexpected HTML in the ESPN API response.
 */
function sanitizeHtml(raw: string): string {
  return raw.replace(/<(?!\/?(?:strong|em)\b)[^>]*>/gi, "").trim();
}

async function espnFetch(path: string): Promise<any> {
  const res = await fetch(`${BASE}/${path}`, {
    next: { revalidate: 60 },
    headers: { "User-Agent": "MatchupLens/1.0" },
  });
  if (!res.ok) throw new Error(`ESPN ${path}: ${res.status}`);
  return res.json();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildSlug(away: Team, home: Team, eventId: string): string {
  return `${slugify(away.shortName)}-vs-${slugify(home.shortName)}-prediction-${eventId}`;
}

export function parseEventId(slug: string): string | null {
  const last = slug.split("-").pop() ?? "";
  return /^\d{6,}$/.test(last) ? last : null;
}

function mapTeam(competitor: any): Team {
  // Team sports have .team; MMA has .athlete
  const t = competitor.team ?? competitor.athlete ?? {};
  const overall =
    (competitor.records ?? []).find((r: any) => r.type === "total")?.summary ??
    competitor.records?.[0]?.summary ??
    "";
  const name = t.displayName ?? t.fullName ?? "TBD";
  const short = t.shortDisplayName ?? t.shortName ?? name;
  return {
    id: String(t.id ?? name),
    name,
    shortName: short,
    abbr: t.abbreviation ?? short.slice(0, 3).toUpperCase(),
    color: t.color ? `#${t.color}` : "#8e8e9c",
    record: overall,
    logo: t.logo ?? t.headshot ?? undefined,
  };
}

function fmtTime(iso: string): { time: string; date: string } {
  const d = new Date(iso);
  return {
    time:
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }) + " ET",
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    }),
  };
}

function mapStats(homeComp: any, awayComp: any): StatComparison[] {
  const hs: any[] = homeComp.statistics ?? [];
  const as: any[] = awayComp.statistics ?? [];
  if (!hs.length || !as.length) return [];
  const out: StatComparison[] = [];
  const seen = new Set<string>();
  for (const stat of hs) {
    if (stat.name?.startsWith("avg")) continue; // skip duplicate averages
    const match = as.find((s) => s.name === stat.name);
    if (!match || seen.has(stat.abbreviation)) continue;
    seen.add(stat.abbreviation);
    const hv = parseFloat(stat.displayValue);
    const av = parseFloat(match.displayValue);
    let better: StatComparison["better"] = "even";
    if (!isNaN(hv) && !isNaN(av) && hv !== av) {
      const lowerWins = LOWER_IS_BETTER.test(stat.name ?? "");
      better = (lowerWins ? hv < av : hv > av) ? "home" : "away";
    }
    out.push({
      name: stat.abbreviation ?? stat.name,
      homeValue: stat.displayValue,
      awayValue: match.displayValue,
      better,
    });
  }
  return out.slice(0, 10);
}

function mapPlayers(homeComp: any, awayComp: any): PlayerCard[] {
  const cards: PlayerCard[] = [];
  for (const comp of [homeComp, awayComp]) {
    const teamAbbr = comp.team?.abbreviation ?? "";
    const byAthlete = new Map<string, PlayerCard>();
    for (const cat of comp.leaders ?? []) {
      const leader = cat.leaders?.[0];
      const ath = leader?.athlete;
      if (!ath || cat.name === "rating") continue;
      const existing = byAthlete.get(ath.id);
      const stat = {
        label: (cat.shortDisplayName ?? cat.abbreviation ?? "").toUpperCase(),
        value: leader.displayValue,
      };
      if (existing) {
        if (existing.stats.length < 4) existing.stats.push(stat);
      } else {
        byAthlete.set(ath.id, {
          name: ath.displayName ?? ath.fullName,
          teamAbbr,
          position: ath.position?.abbreviation ?? "",
          stats: [stat],
          note: `Team leader in ${cat.displayName?.toLowerCase() ?? cat.name}.`,
          image: ath.headshot,
        });
      }
    }
    cards.push(...Array.from(byAthlete.values()).slice(0, 3));
  }
  return cards;
}

function mapEvent(sport: SportId, event: any): GameDetail | null {
  const comp = event.competitions?.[0];
  if (!comp) return null;
  const competitors: any[] = comp.competitors ?? [];
  if (competitors.length < 2) return null;

  const homeComp =
    competitors.find((c) => c.homeAway === "home") ?? competitors[0];
  const awayComp =
    competitors.find((c) => c.homeAway === "away") ?? competitors[1];
  const home = mapTeam(homeComp);
  const away = mapTeam(awayComp);

  const state = event.status?.type?.state; // pre | in | post
  const statusName: string = event.status?.type?.name ?? "";
  const isPostponed =
    statusName.includes("POSTPONED") || statusName.includes("SUSPENDED");
  const isCancelled =
    statusName.includes("CANCELED") || statusName.includes("CANCELLED") || statusName.includes("FORFEIT");
  const status: GameDetail["status"] =
    state === "in"
      ? "live"
      : isPostponed
        ? "postponed"
        : isCancelled
          ? "cancelled"
          : state === "post"
            ? "final"
            : "scheduled";
  const { time, date } = fmtTime(event.date);

  const odds = comp.odds?.[0];
  const prediction = buildPrediction({
    home,
    away,
    homeMoneyline: odds?.homeTeamOdds?.moneyLine,
    awayMoneyline: odds?.awayTeamOdds?.moneyLine,
    oddsDetails: odds?.details,
    neutralSite: comp.neutralSite === true,
    isFight: sport === "ufc",
  });

  const note = comp.notes?.[0]?.headline;
  const seriesSummary = event.series?.summary;
  const headline = comp.headlines?.[0];

  const storylines: GameDetail["overview"]["storylines"] = [];
  if (headline?.shortLinkText)
    storylines.push({ team: "neutral", text: `<strong>ESPN:</strong> ${sanitizeHtml(headline.shortLinkText)}` });
  if (headline?.description && headline.description !== headline.shortLinkText)
    storylines.push({ team: "neutral", text: sanitizeHtml(headline.description) });
  if (seriesSummary)
    storylines.push({ team: "neutral", text: `<strong>Series:</strong> ${sanitizeHtml(seriesSummary)}` });
  if (odds?.details)
    storylines.push({
      team: "neutral",
      text: `<strong>Betting line:</strong> ${sanitizeHtml(odds.details)}${odds.overUnder ? ` · O/U ${odds.overUnder}` : ""}`,
    });

  return {
    id: String(event.id),
    sport,
    league: LEAGUE_LABEL[sport],
    slug: buildSlug(away, home, String(event.id)),
    home,
    away,
    status,
    startTimeLocal: time,
    startTimeUTC: event.date ?? new Date().toISOString(),
    dateLabel: date,
    venue: comp.venue?.fullName ?? "TBD",
    city: [comp.venue?.address?.city, comp.venue?.address?.state]
      .filter(Boolean)
      .join(", "),
    broadcast:
      comp.broadcasts?.[0]?.names?.join(" / ") ?? event.broadcast ?? "—",
    homeScore: homeComp.score ? Number(homeComp.score) : undefined,
    awayScore: awayComp.score ? Number(awayComp.score) : undefined,
    period:
      status === "live"
        ? event.status?.type?.shortDetail ?? "LIVE"
        : undefined,
    winProbHome: prediction.winProbHome,
    contextLabel: [note ?? LEAGUE_LABEL[sport], seriesSummary]
      .filter(Boolean)
      .join(" · "),
    overview: {
      recapTitle:
        status === "final"
          ? `Final — ${away.abbr} ${awayComp.score ?? ""}, ${home.abbr} ${homeComp.score ?? ""}`
          : "Matchup snapshot",
      recapStats: mapStats(homeComp, awayComp).slice(0, 3),
      storylines,
    },
    teamStats: { playoff: [], season: mapStats(homeComp, awayComp) },
    h2h: { homeWins: 0, awayWins: 0, windowLabel: "", games: [], trend: "" },
    injuries: {
      rows: [],
      source: "ESPN · No injury report available for this game",
      updated: date,
    },
    players: mapPlayers(homeComp, awayComp),
    prediction,
    ats: odds
      ? [
          { label: "Line", value: odds.details ?? "—" },
          ...(odds.overUnder ? [{ label: "Over/Under", value: String(odds.overUnder) }] : []),
          ...(odds.homeTeamOdds?.moneyLine != null
            ? [{ label: `${home.abbr} moneyline`, value: String(odds.homeTeamOdds.moneyLine) }]
            : []),
          ...(odds.awayTeamOdds?.moneyLine != null
            ? [{ label: `${away.abbr} moneyline`, value: String(odds.awayTeamOdds.moneyLine) }]
            : []),
        ]
      : [{ label: "Odds", value: "TBD" }],
  };
}

/**
 * Returns true if the sport is currently in-season (regular or post).
 * ESPN season.type: 1=pre, 2=regular, 3=post, 4=offseason.
 */
export async function fetchSeasonStatus(sport: SportId): Promise<boolean> {
  try {
    const data = await espnFetch(`${LEAGUE_PATH[sport]}/scoreboard`);
    const seasonType: number = data.season?.type ?? 2;
    return seasonType !== 4;
  } catch {
    return true; // default to in-season on fetch failure
  }
}

export async function fetchLiveGames(sport: SportId): Promise<GameDetail[]> {
  const data = await espnFetch(`${LEAGUE_PATH[sport]}/scoreboard`);
  const events: any[] = data.events ?? [];
  return events
    .map((e) => {
      try {
        return mapEvent(sport, e);
      } catch {
        return null;
      }
    })
    .filter((g): g is GameDetail => g !== null);
}
