// Data contracts for MatchupIQ.
// Shapes mirror what a real sports API (SportRadar / SportsDataIO) returns,
// so swapping sample data for live data only requires changing lib/api.ts.

export type SportId =
  | "nba"
  | "wnba"
  | "nfl"
  | "mlb"
  | "nhl"
  | "ncaaf"
  | "ncaab"
  | "ufc"
  | "soccer"
  | "worldcup";

export interface Sport {
  id: SportId;
  label: string;
  inSeason: boolean;
}

export interface Team {
  id: string;
  name: string; // "New York Knicks"
  shortName: string; // "Knicks"
  abbr: string; // "NYK"
  color: string; // hex
  record: string; // "57-25"
  logo?: string; // team logo URL (from live API)
  slug?: string; // team-page slug, e.g. "new-york-knicks"
}

export interface GameSummary {
  id: string;
  sport: SportId;
  league: string; // "NBA Finals", "MLB", ...
  slug: string; // SEO url segment
  home: Team;
  away: Team;
  status: "scheduled" | "live" | "final" | "postponed" | "cancelled";
  startTimeLocal: string; // "9:00 PM ET" — ET fallback for SSR
  startTimeUTC: string;   // ISO-8601 UTC — used by LocalTime for browser tz
  dateLabel: string; // "Jun 11, 2026"
  venue: string;
  city: string;
  broadcast: string;
  homeScore?: number;
  awayScore?: number;
  period?: string; // "Q3 4:12" when live
  winProbHome: number; // 0-100
  contextLabel?: string; // "NBA Finals · Game 5 · Series tied 2-2"
}

export interface SeriesGame {
  label: string; // "G1"
  result?: string; // "NYK 112-104"
  winnerAbbr?: string;
  isNow?: boolean;
  note?: string; // "TBD · MSG" or "9:00 PM"
}

export interface StatComparison {
  name: string;
  homeValue: string;
  awayValue: string;
  better: "home" | "away" | "even";
}

export interface H2HGame {
  date: string;
  score: string;
  location: string;
  winnerAbbr: string;
}

export interface H2H {
  homeWins: number;
  awayWins: number;
  windowLabel: string; // "Last 10 meetings"
  games: H2HGame[];
  trend: string;
}

export interface PlayerCard {
  name: string;
  teamAbbr: string;
  position: string;
  stats: { label: string; value: string }[];
  note: string;
  image?: string; // headshot URL (from live API)
}

export interface InjuryRow {
  player: string;
  teamAbbr: string;
  injury: string;
  status: "Playing" | "Questionable" | "Out" | "Healthy";
}

export interface PredictionFactor {
  icon: string;
  name: string;
  description: string;
  impact: number; // +/- percentage points toward HOME team
}

export interface Prediction {
  winProbHome: number;
  methodology: string;
  factors: PredictionFactor[];
  pickAbbr: string;
  pickTeamName: string;
  reasoning: string;
  confidence: "Low" | "Medium" | "High";
}

export interface GameDetail extends GameSummary {
  seriesTracker?: SeriesGame[];
  overview: {
    recapTitle: string;
    recapStats: StatComparison[];
    storylines: { team: "home" | "away" | "neutral"; text: string }[];
  };
  teamStats: { playoff: StatComparison[]; season: StatComparison[] };
  h2h: H2H;
  players: PlayerCard[];
  injuries: { rows: InjuryRow[]; source: string; updated: string };
  prediction: Prediction;
  ats: { label: string; value: string }[]; // against-the-spread records for sidebar
}

// ── Evergreen team + matchup pages ──────────────────────────────────────────
export interface TeamRef {
  id: string;
  slug: string; // ESPN slug, e.g. "los-angeles-lakers"
  name: string; // "Los Angeles Lakers"
  shortName: string; // "Lakers"
  abbr: string; // "LAL"
  color: string; // hex
  logo?: string;
}

export interface TeamGameRef {
  eventId: string;
  slug: string; // matchup game-page slug: /{sport}/{slug}
  opponentShort: string;
  opponentAbbr: string;
  opponentTeamSlug?: string; // for /{sport}/team/{slug} link when resolvable
  isHome: boolean;
  dateLabel: string;
  startTimeUTC: string;
  status: GameSummary["status"];
  teamScore?: number;
  oppScore?: number;
  result?: "W" | "L" | "D";
}

export interface TeamPageData {
  team: TeamRef;
  record: string; // "12-5" derived from completed games
  homeRecord: string;
  awayRecord: string;
  form: ("W" | "L" | "D")[]; // most-recent first, up to 5
  upcoming: TeamGameRef[];
  recent: TeamGameRef[];
}
