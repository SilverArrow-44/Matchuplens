import type { GameDetail, GameSummary, Sport, Team } from "./types";

// ----------------------------------------------------------------------------
// SAMPLE DATA — replace by wiring lib/api.ts to a live sports API.
// Shapes match lib/types.ts which mirror SportRadar-style responses.
// ----------------------------------------------------------------------------

export const SPORTS: Sport[] = [
  { id: "nba", label: "NBA", inSeason: true },
  { id: "worldcup", label: "World Cup 2026", inSeason: true },
  { id: "mlb", label: "MLB", inSeason: true },
  { id: "nhl", label: "NHL", inSeason: true },
  { id: "ufc", label: "UFC", inSeason: true },
  { id: "soccer", label: "Soccer", inSeason: true },
  { id: "nfl", label: "NFL", inSeason: false },
];

const NYK: Team = { id: "nyk", name: "New York Knicks", shortName: "Knicks", abbr: "NYK", color: "#4a90e2", record: "57-25" };
const SAS: Team = { id: "sas", name: "San Antonio Spurs", shortName: "Spurs", abbr: "SAS", color: "#7a8699", record: "55-27" };
const NYY: Team = { id: "nyy", name: "New York Yankees", shortName: "Yankees", abbr: "NYY", color: "#5a7fc0", record: "41-25" };
const BOS: Team = { id: "bos", name: "Boston Red Sox", shortName: "Red Sox", abbr: "BOS", color: "#c0392b", record: "35-31" };
const LAD: Team = { id: "lad", name: "Los Angeles Dodgers", shortName: "Dodgers", abbr: "LAD", color: "#4a90e2", record: "44-22" };
const SDP: Team = { id: "sdp", name: "San Diego Padres", shortName: "Padres", abbr: "SDP", color: "#a98447", record: "38-28" };
const EDM: Team = { id: "edm", name: "Edmonton Oilers", shortName: "Oilers", abbr: "EDM", color: "#e67e22", record: "49-27-6" };
const FLA: Team = { id: "fla", name: "Florida Panthers", shortName: "Panthers", abbr: "FLA", color: "#c0392b", record: "52-24-6" };
const MIA: Team = { id: "mia", name: "Inter Miami CF", shortName: "Inter Miami", abbr: "MIA", color: "#d6589f", record: "9-3-4" };
const NYC: Team = { id: "nycfc", name: "New York City FC", shortName: "NYCFC", abbr: "NYC", color: "#6cace4", record: "8-5-3" };

// ---------- Featured game: NBA Finals Game 5 ----------

const knicksSpurs: GameDetail = {
  id: "nba-nyk-sas-g5-2026",
  sport: "nba",
  league: "NBA Finals",
  slug: "knicks-vs-spurs-game-5-prediction-june-11-2026",
  home: NYK,
  away: SAS,
  status: "scheduled",
  startTimeLocal: "8:30 PM ET",
  startTimeUTC: "2026-06-13T00:30:00Z",
  dateLabel: "Jun 11, 2026",
  venue: "Madison Square Garden",
  city: "New York, NY",
  broadcast: "ABC / ESPN+",
  winProbHome: 58.3,
  contextLabel: "NBA Finals · Game 5 · Series tied 2-2",
  seriesTracker: [
    { label: "G1", result: "NYK 112-104", winnerAbbr: "NYK" },
    { label: "G2", result: "SAS 119-108", winnerAbbr: "SAS" },
    { label: "G3", result: "SAS 101-96", winnerAbbr: "SAS" },
    { label: "G4", result: "NYK 121-113", winnerAbbr: "NYK" },
    { label: "G5", isNow: true, note: "8:30 PM ET · MSG" },
    { label: "G6", note: "Jun 14 · San Antonio" },
    { label: "G7", note: "If nec. · MSG" },
  ],
  overview: {
    recapTitle: "Game 4 recap — NYK 121, SAS 113",
    recapStats: [
      { name: "Points off turnovers", homeValue: "23", awayValue: "11", better: "home" },
      { name: "Assists", homeValue: "29", awayValue: "22", better: "home" },
      { name: "Turnovers", homeValue: "9", awayValue: "16", better: "home" },
    ],
    storylines: [
      { team: "home", text: "<strong>Brunson finds his rhythm.</strong> After a cold Game 3, Jalen Brunson dropped 36 on 54% shooting in Game 4. MSG crowds historically lift his scoring by +4.1 PPG." },
      { team: "away", text: "<strong>Wembanyama's foul trouble.</strong> Victor Wembanyama picked up 5 fouls in Game 4 and played just 31 minutes. San Antonio is -18 in this series when he sits." },
      { team: "home", text: "<strong>Home court is real in this series.</strong> All four games have been won by the home team. Game 5 is at MSG." },
      { team: "away", text: "<strong>Spurs' three-point variance.</strong> SAS shot 31% from deep in Game 4 versus 41% in their two wins. Their offense lives and dies beyond the arc." },
      { team: "neutral", text: "<strong>Whistle watch.</strong> Game 5 crew has called the 4th-most fouls per game this postseason — bonus points could matter late." },
    ],
  },
  teamStats: {
    playoff: [
      { name: "Offensive rating", homeValue: "117.8", awayValue: "115.2", better: "home" },
      { name: "Defensive rating", homeValue: "110.4", awayValue: "108.9", better: "away" },
      { name: "Net rating", homeValue: "+7.4", awayValue: "+6.3", better: "home" },
      { name: "Points per game", homeValue: "112.6", awayValue: "110.1", better: "home" },
      { name: "Assists per game", homeValue: "26.4", awayValue: "24.8", better: "home" },
      { name: "Turnovers per game", homeValue: "11.2", awayValue: "13.5", better: "home" },
      { name: "Off. rebounds per game", homeValue: "10.8", awayValue: "11.9", better: "away" },
      { name: "True shooting %", homeValue: "58.1%", awayValue: "57.3%", better: "home" },
      { name: "Bench points per game", homeValue: "28.4", awayValue: "35.2", better: "away" },
    ],
    season: [
      { name: "Offensive rating", homeValue: "116.2", awayValue: "114.7", better: "home" },
      { name: "Defensive rating", homeValue: "111.1", awayValue: "110.2", better: "away" },
      { name: "Net rating", homeValue: "+5.1", awayValue: "+4.5", better: "home" },
      { name: "Points per game", homeValue: "114.9", awayValue: "113.4", better: "home" },
      { name: "True shooting %", homeValue: "57.6%", awayValue: "58.0%", better: "away" },
    ],
  },
  h2h: {
    homeWins: 6,
    awayWins: 4,
    windowLabel: "Last 10 meetings",
    trend: "The home team has won 8 of the last 10 meetings. NYK averages 7.2 more points at MSG vs SAS than on the road.",
    games: [
      { date: "Jun 8, 2026", score: "NYK 121-113", location: "New York", winnerAbbr: "NYK" },
      { date: "Jun 5, 2026", score: "SAS 101-96", location: "San Antonio", winnerAbbr: "SAS" },
      { date: "Jun 3, 2026", score: "SAS 119-108", location: "San Antonio", winnerAbbr: "SAS" },
      { date: "May 31, 2026", score: "NYK 112-104", location: "New York", winnerAbbr: "NYK" },
      { date: "Feb 12, 2026", score: "NYK 118-110", location: "New York", winnerAbbr: "NYK" },
      { date: "Dec 19, 2025", score: "SAS 124-117", location: "San Antonio", winnerAbbr: "SAS" },
      { date: "Mar 8, 2025", score: "NYK 109-102", location: "New York", winnerAbbr: "NYK" },
      { date: "Jan 22, 2025", score: "NYK 115-111", location: "San Antonio", winnerAbbr: "NYK" },
      { date: "Nov 14, 2024", score: "SAS 120-114", location: "San Antonio", winnerAbbr: "SAS" },
      { date: "Apr 2, 2024", score: "NYK 106-98", location: "New York", winnerAbbr: "NYK" },
    ],
  },
  players: [
    {
      name: "Jalen Brunson", teamAbbr: "NYK", position: "PG",
      stats: [
        { label: "PTS", value: "36" }, { label: "AST", value: "8" },
        { label: "REB", value: "4" }, { label: "FG%", value: "54" },
      ],
      note: "Bounced back from a 6-for-19 Game 3. Averages 31.2 PPG at home this postseason.",
    },
    {
      name: "Karl-Anthony Towns", teamAbbr: "NYK", position: "C",
      stats: [
        { label: "PTS", value: "24" }, { label: "REB", value: "13" },
        { label: "AST", value: "3" }, { label: "3PM", value: "4" },
      ],
      note: "The Towns–Wembanyama matchup is the series' chess match. Doing damage when pulled to the perimeter.",
    },
    {
      name: "OG Anunoby", teamAbbr: "NYK", position: "F",
      stats: [
        { label: "PTS", value: "17" }, { label: "STL", value: "3" },
        { label: "REB", value: "6" }, { label: "+/-", value: "+14" },
      ],
      note: "Primary defender on SAS's leading wing scorer. Knicks are +31 with him on the floor this series.",
    },
    {
      name: "Victor Wembanyama", teamAbbr: "SAS", position: "C",
      stats: [
        { label: "PTS", value: "27" }, { label: "BLK", value: "4" },
        { label: "REB", value: "12" }, { label: "FG%", value: "49" },
      ],
      note: "Foul trouble limited him to 31 minutes in Game 4. SAS is -18 in the series with him off the floor.",
    },
    {
      name: "De'Aaron Fox", teamAbbr: "SAS", position: "PG",
      stats: [
        { label: "PTS", value: "22" }, { label: "AST", value: "9" },
        { label: "STL", value: "2" }, { label: "TOV", value: "5" },
      ],
      note: "Pace engine for the Spurs. Turnover-prone against NYK's point-of-attack pressure (4.3 TOV/gm in series).",
    },
    {
      name: "Devin Vassell", teamAbbr: "SAS", position: "SG",
      stats: [
        { label: "PTS", value: "14" }, { label: "3PM", value: "2" },
        { label: "REB", value: "5" }, { label: "FG%", value: "38" },
      ],
      note: "Shooting just 33% from three in the series after a 39% regular season. Regression candidate — in SAS's favor.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live injury feed",
    updated: "Jun 11, 2026, 2:00 PM ET",
    rows: [
      { player: "Jalen Brunson", teamAbbr: "NYK", injury: "Right ankle soreness — managed", status: "Playing" },
      { player: "Mitchell Robinson", teamAbbr: "NYK", injury: "Left knee inflammation", status: "Questionable" },
      { player: "Josh Hart", teamAbbr: "NYK", injury: "No injuries reported", status: "Healthy" },
      { player: "Victor Wembanyama", teamAbbr: "SAS", injury: "No injuries reported", status: "Healthy" },
      { player: "Jeremy Sochan", teamAbbr: "SAS", injury: "Lower back tightness", status: "Questionable" },
      { player: "Keldon Johnson", teamAbbr: "SAS", injury: "Right hamstring strain", status: "Out" },
    ],
  },
  prediction: {
    winProbHome: 58.3,
    methodology:
      "Win probability starts from the NBA playoff home-court base rate (~57%) and adjusts for net rating differential, head-to-head home record, matchup advantages, recent form, injuries, and shooting regression.",
    factors: [
      { icon: "🏠", name: "Home court at MSG", description: "All 4 games this series won by the home team; playoff home base rate ~57%.", impact: 7 },
      { icon: "📊", name: "Net rating edge", description: "NYK +7.4 playoff net rating vs SAS +6.3.", impact: 2 },
      { icon: "🤕", name: "Spurs injuries", description: "Keldon Johnson out, Sochan questionable — SAS bench depth was their series edge.", impact: 4 },
      { icon: "🔥", name: "Brunson home splits", description: "31.2 PPG at home this postseason vs 24.8 on the road.", impact: 3 },
      { icon: "🛡️", name: "Wembanyama rim protection", description: "4.1 blocks per game this series; NYK shooting 12% worse at the rim vs SAS.", impact: -5 },
      { icon: "🎯", name: "Vassell shooting regression", description: "33% from three in the series vs 39% season average — positive regression likely.", impact: -3 },
      { icon: "⚡", name: "Rest & travel", description: "Both teams on 2 days rest; SAS traveled. Minor edge.", impact: 1 },
    ],
    pickAbbr: "NYK",
    pickTeamName: "New York Knicks",
    reasoning:
      "Home court has decided every game of this series, and the Spurs come to MSG with their bench depth compromised by injuries. Wembanyama keeps it close, but Brunson's home splits and the turnover battle tilt Game 5 to New York.",
    confidence: "Medium",
  },
  ats: [
    { label: "NYK ATS (playoffs)", value: "12-7" },
    { label: "SAS ATS (playoffs)", value: "11-8" },
    { label: "Series O/U", value: "Over 3-1" },
    { label: "NYK home ATS", value: "8-3" },
  ],
};

// ---------- Compact builder for non-featured games ----------

function basicGame(g: GameDetail): GameDetail {
  return g;
}

const yankeesRedSox: GameDetail = basicGame({
  id: "mlb-nyy-bos-2026-06-11",
  sport: "mlb",
  league: "MLB",
  slug: "yankees-vs-red-sox-prediction-june-11-2026",
  home: NYY,
  away: BOS,
  status: "scheduled",
  startTimeLocal: "7:05 PM ET",
  startTimeUTC: "2026-06-12T23:05:00Z",
  dateLabel: "Jun 11, 2026",
  venue: "Yankee Stadium",
  city: "Bronx, NY",
  broadcast: "YES / MLB.TV",
  winProbHome: 61.5,
  contextLabel: "AL East rivalry · Game 2 of 3",
  overview: {
    recapTitle: "Last night — NYY 6, BOS 3",
    recapStats: [
      { name: "Hits", homeValue: "11", awayValue: "7", better: "home" },
      { name: "Home runs", homeValue: "2", awayValue: "1", better: "home" },
      { name: "Bullpen ERA (series)", homeValue: "1.50", awayValue: "4.91", better: "home" },
    ],
    storylines: [
      { team: "home", text: "<strong>Judge stays hot.</strong> Aaron Judge has homered in 4 straight games and owns a 1.102 OPS at home this season." },
      { team: "away", text: "<strong>Boston's lefty problem.</strong> Red Sox are hitting .218 vs left-handed starters; they face one tonight." },
      { team: "neutral", text: "<strong>Weather factor.</strong> 15 mph wind blowing out to right field — favors lefty pull hitters in this park." },
    ],
  },
  teamStats: {
    playoff: [],
    season: [
      { name: "Runs per game", homeValue: "5.4", awayValue: "4.7", better: "home" },
      { name: "Team ERA", homeValue: "3.42", awayValue: "4.05", better: "home" },
      { name: "Team OPS", homeValue: ".782", awayValue: ".741", better: "home" },
      { name: "Errors", homeValue: "38", awayValue: "31", better: "away" },
      { name: "Bullpen ERA", homeValue: "3.61", awayValue: "3.88", better: "home" },
    ],
  },
  h2h: {
    homeWins: 7,
    awayWins: 3,
    windowLabel: "Last 10 meetings",
    trend: "Yankees have taken 7 of 10, but 4 of Boston's last 5 losses in the Bronx were one-run games.",
    games: [
      { date: "Jun 10, 2026", score: "NYY 6-3", location: "Bronx", winnerAbbr: "NYY" },
      { date: "May 17, 2026", score: "NYY 4-2", location: "Boston", winnerAbbr: "NYY" },
      { date: "May 16, 2026", score: "BOS 8-5", location: "Boston", winnerAbbr: "BOS" },
      { date: "May 15, 2026", score: "NYY 3-1", location: "Boston", winnerAbbr: "NYY" },
      { date: "Apr 22, 2026", score: "NYY 7-4", location: "Bronx", winnerAbbr: "NYY" },
      { date: "Apr 21, 2026", score: "BOS 5-4", location: "Bronx", winnerAbbr: "BOS" },
      { date: "Sep 14, 2025", score: "NYY 9-2", location: "Bronx", winnerAbbr: "NYY" },
      { date: "Sep 13, 2025", score: "NYY 2-1", location: "Bronx", winnerAbbr: "NYY" },
      { date: "Aug 3, 2025", score: "BOS 6-5", location: "Boston", winnerAbbr: "BOS" },
      { date: "Aug 2, 2025", score: "NYY 5-0", location: "Boston", winnerAbbr: "NYY" },
    ],
  },
  players: [
    {
      name: "Aaron Judge", teamAbbr: "NYY", position: "RF",
      stats: [
        { label: "AVG", value: ".328" }, { label: "HR", value: "24" },
        { label: "RBI", value: "58" }, { label: "OPS", value: "1.071" },
      ],
      note: "Homered in 4 straight. Career .989 OPS vs tonight's Boston starter.",
    },
    {
      name: "Rafael Devers", teamAbbr: "BOS", position: "DH",
      stats: [
        { label: "AVG", value: ".291" }, { label: "HR", value: "17" },
        { label: "RBI", value: "49" }, { label: "OPS", value: ".902" },
      ],
      note: "Boston's best bat, but hitting .206 vs lefties this season.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live injury feed",
    updated: "Jun 11, 2026, 1:00 PM ET",
    rows: [
      { player: "Giancarlo Stanton", teamAbbr: "NYY", injury: "Hamstring tightness", status: "Questionable" },
      { player: "Trevor Story", teamAbbr: "BOS", injury: "Shoulder inflammation", status: "Out" },
    ],
  },
  prediction: {
    winProbHome: 61.5,
    methodology:
      "Probability blends starting pitcher matchup, park factors, bullpen availability, and lineup splits vs starter handedness.",
    factors: [
      { icon: "⚾", name: "Pitching matchup", description: "NYY starter: 2.95 ERA last 5 starts; BOS counters with a 4.60 ERA arm.", impact: 6 },
      { icon: "🏟️", name: "Park + wind", description: "Wind out to right at Yankee Stadium favors NYY's lefty pull power.", impact: 2 },
      { icon: "🥶", name: "BOS vs lefties", description: "Boston hitting .218 against left-handed starters.", impact: 4 },
      { icon: "🤕", name: "Story out", description: "Boston missing its starting shortstop weakens infield defense.", impact: 2 },
      { icon: "📉", name: "One-run game variance", description: "4 of Boston's last 5 losses in the Bronx were one-run games — closer than record suggests.", impact: -3 },
    ],
    pickAbbr: "NYY",
    pickTeamName: "New York Yankees",
    reasoning:
      "The pitching matchup and Boston's struggles against left-handed starters give the Yankees a clear edge at home.",
    confidence: "Medium",
  },
  ats: [
    { label: "NYY run line", value: "34-32" },
    { label: "BOS run line", value: "31-35" },
    { label: "NYY home O/U", value: "Over 18-15" },
  ],
});

const dodgersPadres: GameDetail = basicGame({
  id: "mlb-lad-sdp-2026-06-11",
  sport: "mlb",
  league: "MLB",
  slug: "dodgers-vs-padres-prediction-june-11-2026",
  home: LAD,
  away: SDP,
  status: "scheduled",
  startTimeLocal: "10:10 PM ET",
  startTimeUTC: "2026-06-13T02:10:00Z",
  dateLabel: "Jun 11, 2026",
  venue: "Dodger Stadium",
  city: "Los Angeles, CA",
  broadcast: "SNLA / MLB.TV",
  winProbHome: 57.0,
  contextLabel: "NL West rivalry · Game 1 of 4",
  overview: {
    recapTitle: "Series opener tonight",
    recapStats: [
      { name: "Last 10 record", homeValue: "7-3", awayValue: "6-4", better: "home" },
      { name: "Run differential (June)", homeValue: "+21", awayValue: "+9", better: "home" },
      { name: "Team ERA (June)", homeValue: "3.10", awayValue: "3.55", better: "home" },
    ],
    storylines: [
      { team: "home", text: "<strong>Ohtani two-way night.</strong> Shohei Ohtani starts on the mound and bats leadoff — first time facing San Diego as a pitcher this season." },
      { team: "away", text: "<strong>Padres' road resilience.</strong> San Diego owns the NL's best road record at 22-11." },
      { team: "neutral", text: "<strong>Division stakes.</strong> LAD leads SDP by 5.5 games — a Padres sweep makes it a race again." },
    ],
  },
  teamStats: {
    playoff: [],
    season: [
      { name: "Runs per game", homeValue: "5.8", awayValue: "4.9", better: "home" },
      { name: "Team ERA", homeValue: "3.28", awayValue: "3.51", better: "home" },
      { name: "Team OPS", homeValue: ".801", awayValue: ".752", better: "home" },
      { name: "Road record", homeValue: "20-13", awayValue: "22-11", better: "away" },
      { name: "Bullpen ERA", homeValue: "3.70", awayValue: "3.32", better: "away" },
    ],
  },
  h2h: {
    homeWins: 6,
    awayWins: 4,
    windowLabel: "Last 10 meetings",
    trend: "Six of the last ten have been decided by 2 runs or fewer. Expect a tight, bullpen-heavy series.",
    games: [
      { date: "May 25, 2026", score: "LAD 4-3", location: "San Diego", winnerAbbr: "LAD" },
      { date: "May 24, 2026", score: "SDP 6-2", location: "San Diego", winnerAbbr: "SDP" },
      { date: "May 23, 2026", score: "LAD 3-2", location: "San Diego", winnerAbbr: "LAD" },
      { date: "Apr 10, 2026", score: "LAD 8-4", location: "Los Angeles", winnerAbbr: "LAD" },
      { date: "Apr 9, 2026", score: "SDP 5-4", location: "Los Angeles", winnerAbbr: "SDP" },
      { date: "Apr 8, 2026", score: "LAD 6-1", location: "Los Angeles", winnerAbbr: "LAD" },
      { date: "Sep 21, 2025", score: "SDP 7-6", location: "San Diego", winnerAbbr: "SDP" },
      { date: "Sep 20, 2025", score: "LAD 5-3", location: "San Diego", winnerAbbr: "LAD" },
      { date: "Aug 15, 2025", score: "SDP 4-2", location: "Los Angeles", winnerAbbr: "SDP" },
      { date: "Aug 14, 2025", score: "LAD 9-5", location: "Los Angeles", winnerAbbr: "LAD" },
    ],
  },
  players: [
    {
      name: "Shohei Ohtani", teamAbbr: "LAD", position: "SP/DH",
      stats: [
        { label: "ERA", value: "2.61" }, { label: "K/9", value: "11.8" },
        { label: "HR", value: "21" }, { label: "OPS", value: "1.034" },
      ],
      note: "Two-way start tonight. Padres hitters are 6-for-41 (.146) career against him.",
    },
    {
      name: "Fernando Tatis Jr.", teamAbbr: "SDP", position: "RF",
      stats: [
        { label: "AVG", value: ".302" }, { label: "HR", value: "16" },
        { label: "SB", value: "18" }, { label: "OPS", value: ".917" },
      ],
      note: "Hitting .355 over his last 15 games. Career .896 OPS at Dodger Stadium.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live injury feed",
    updated: "Jun 11, 2026, 1:00 PM ET",
    rows: [
      { player: "Mookie Betts", teamAbbr: "LAD", injury: "No injuries reported", status: "Healthy" },
      { player: "Yu Darvish", teamAbbr: "SDP", injury: "Elbow inflammation (15-day IL)", status: "Out" },
    ],
  },
  prediction: {
    winProbHome: 57.0,
    methodology:
      "Probability blends starting pitcher matchup, park factors, bullpen availability, and recent form.",
    factors: [
      { icon: "⚾", name: "Ohtani on the mound", description: "2.61 ERA, and Padres hitters are .146 career against him.", impact: 7 },
      { icon: "🏠", name: "Home field", description: "Dodgers are 24-9 at home this season.", impact: 3 },
      { icon: "🛣️", name: "Padres road form", description: "Best road record in the NL (22-11).", impact: -4 },
      { icon: "💪", name: "Bullpen edge SDP", description: "Padres bullpen ERA 3.32 vs LAD 3.70 — matters in a close game.", impact: -3 },
    ],
    pickAbbr: "LAD",
    pickTeamName: "Los Angeles Dodgers",
    reasoning:
      "Ohtani's dominance over this Padres lineup is the deciding factor, though San Diego's bullpen keeps the margin tight.",
    confidence: "Medium",
  },
  ats: [
    { label: "LAD run line", value: "35-31" },
    { label: "SDP run line", value: "36-30" },
  ],
});

const oilersPanthers: GameDetail = basicGame({
  id: "nhl-edm-fla-scf-g3-2026",
  sport: "nhl",
  league: "Stanley Cup Final",
  slug: "oilers-vs-panthers-game-3-prediction-june-11-2026",
  home: EDM,
  away: FLA,
  status: "scheduled",
  startTimeLocal: "8:00 PM ET",
  startTimeUTC: "2026-06-13T00:00:00Z",
  dateLabel: "Jun 11, 2026",
  venue: "Rogers Place",
  city: "Edmonton, AB",
  broadcast: "TNT / Sportsnet",
  winProbHome: 52.5,
  contextLabel: "Stanley Cup Final · Game 3 · Series tied 1-1",
  seriesTracker: [
    { label: "G1", result: "FLA 4-2", winnerAbbr: "FLA" },
    { label: "G2", result: "EDM 5-3", winnerAbbr: "EDM" },
    { label: "G3", isNow: true, note: "8:00 PM ET · Edmonton" },
    { label: "G4", note: "Jun 13 · Edmonton" },
    { label: "G5", note: "Jun 16 · Sunrise" },
    { label: "G6", note: "If nec. · Edmonton" },
    { label: "G7", note: "If nec. · Sunrise" },
  ],
  overview: {
    recapTitle: "Game 2 recap — EDM 5, FLA 3",
    recapStats: [
      { name: "Shots on goal", homeValue: "34", awayValue: "29", better: "home" },
      { name: "Power play", homeValue: "2/4", awayValue: "0/3", better: "home" },
      { name: "Faceoff %", homeValue: "46%", awayValue: "54%", better: "away" },
    ],
    storylines: [
      { team: "home", text: "<strong>McDavid takes over.</strong> Connor McDavid had 4 points in Game 2 and leads the playoffs in scoring." },
      { team: "away", text: "<strong>Bobrovsky's rebound history.</strong> Sergei Bobrovsky is 8-1 with a .934 SV% after allowing 4+ goals in these playoffs." },
      { team: "neutral", text: "<strong>Special teams battle.</strong> EDM's power play (31%) vs FLA's penalty kill (88%) is the series' decisive matchup." },
    ],
  },
  teamStats: {
    playoff: [
      { name: "Goals per game", homeValue: "3.6", awayValue: "3.2", better: "home" },
      { name: "Goals against per game", homeValue: "2.9", awayValue: "2.4", better: "away" },
      { name: "Power play %", homeValue: "31.0%", awayValue: "24.5%", better: "home" },
      { name: "Penalty kill %", homeValue: "81.2%", awayValue: "88.1%", better: "away" },
      { name: "Save %", homeValue: ".901", awayValue: ".921", better: "away" },
    ],
    season: [
      { name: "Goals per game", homeValue: "3.5", awayValue: "3.3", better: "home" },
      { name: "Goals against per game", homeValue: "3.0", awayValue: "2.6", better: "away" },
    ],
  },
  h2h: {
    homeWins: 4,
    awayWins: 6,
    windowLabel: "Last 10 meetings",
    trend: "Florida has won 6 of 10, but Edmonton is 3-1 in the last 4 at Rogers Place.",
    games: [
      { date: "Jun 9, 2026", score: "EDM 5-3", location: "Sunrise", winnerAbbr: "EDM" },
      { date: "Jun 6, 2026", score: "FLA 4-2", location: "Sunrise", winnerAbbr: "FLA" },
      { date: "Feb 27, 2026", score: "EDM 4-3 OT", location: "Edmonton", winnerAbbr: "EDM" },
      { date: "Nov 20, 2025", score: "FLA 5-2", location: "Sunrise", winnerAbbr: "FLA" },
      { date: "Jun 17, 2025", score: "FLA 2-1", location: "Sunrise", winnerAbbr: "FLA" },
      { date: "Jun 14, 2025", score: "EDM 3-2", location: "Edmonton", winnerAbbr: "EDM" },
      { date: "Jun 12, 2025", score: "FLA 4-3", location: "Edmonton", winnerAbbr: "FLA" },
      { date: "Jun 10, 2025", score: "FLA 5-4", location: "Sunrise", winnerAbbr: "FLA" },
      { date: "Dec 16, 2024", score: "EDM 4-1", location: "Edmonton", winnerAbbr: "EDM" },
      { date: "Nov 27, 2024", score: "FLA 3-0", location: "Sunrise", winnerAbbr: "FLA" },
    ],
  },
  players: [
    {
      name: "Connor McDavid", teamAbbr: "EDM", position: "C",
      stats: [
        { label: "G", value: "11" }, { label: "A", value: "24" },
        { label: "PTS", value: "35" }, { label: "+/-", value: "+12" },
      ],
      note: "Leads all playoff scorers. 4 points in Game 2; has a point in 14 straight games.",
    },
    {
      name: "Sergei Bobrovsky", teamAbbr: "FLA", position: "G",
      stats: [
        { label: "W", value: "13" }, { label: "SV%", value: ".918" },
        { label: "GAA", value: "2.31" }, { label: "SO", value: "2" },
      ],
      note: "Historically elite after bad starts: 8-1 with .934 SV% following 4+ goal games these playoffs.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live injury feed",
    updated: "Jun 11, 2026, 12:00 PM ET",
    rows: [
      { player: "Zach Hyman", teamAbbr: "EDM", injury: "Upper body — day to day", status: "Questionable" },
      { player: "Aaron Ekblad", teamAbbr: "FLA", injury: "No injuries reported", status: "Healthy" },
    ],
  },
  prediction: {
    winProbHome: 52.5,
    methodology:
      "Probability starts from home-ice base rate and adjusts for goaltending form, special teams matchup, and injuries.",
    factors: [
      { icon: "🏠", name: "Home ice", description: "First game in Edmonton; Oilers were 28-8-5 at Rogers Place this season.", impact: 4 },
      { icon: "⚡", name: "Power play edge", description: "EDM's 31% playoff power play vs FLA's penalty kill.", impact: 3 },
      { icon: "🥅", name: "Bobrovsky bounce-back", description: "8-1 with .934 SV% after allowing 4+ goals these playoffs.", impact: -4 },
      { icon: "🤕", name: "Hyman questionable", description: "EDM's top net-front presence is day-to-day.", impact: -1 },
    ],
    pickAbbr: "EDM",
    pickTeamName: "Edmonton Oilers",
    reasoning:
      "A coin-flip game. Home ice and the McDavid-led power play give Edmonton the slightest edge, but Bobrovsky's bounce-back pattern makes this the lowest-confidence pick on the board.",
    confidence: "Low",
  },
  ats: [
    { label: "EDM puck line (playoffs)", value: "10-9" },
    { label: "FLA puck line (playoffs)", value: "12-8" },
    { label: "Series O/U", value: "Over 2-0" },
  ],
});

const miamiNycfc: GameDetail = basicGame({
  id: "mls-mia-nyc-2026-06-11",
  sport: "soccer",
  league: "MLS",
  slug: "inter-miami-vs-nycfc-prediction-june-11-2026",
  home: MIA,
  away: NYC,
  status: "scheduled",
  startTimeLocal: "7:30 PM ET",
  startTimeUTC: "2026-06-12T23:30:00Z",
  dateLabel: "Jun 11, 2026",
  venue: "Chase Stadium",
  city: "Fort Lauderdale, FL",
  broadcast: "MLS Season Pass",
  winProbHome: 48.0,
  contextLabel: "MLS · Eastern Conference",
  overview: {
    recapTitle: "Form guide",
    recapStats: [
      { name: "Last 5 (W-D-L)", homeValue: "3-1-1", awayValue: "2-2-1", better: "home" },
      { name: "Goals scored (last 5)", homeValue: "11", awayValue: "8", better: "home" },
      { name: "Goals conceded (last 5)", homeValue: "7", awayValue: "4", better: "away" },
    ],
    storylines: [
      { team: "home", text: "<strong>Attack vs defense.</strong> Miami has the East's most goals; NYCFC has its fewest conceded." },
      { team: "away", text: "<strong>NYCFC's road shape.</strong> Unbeaten in 5 straight away matches (3W-2D), all with a low block and counters." },
      { team: "neutral", text: "<strong>Heat and humidity.</strong> 88°F at kickoff in Fort Lauderdale — late-game legs will matter." },
    ],
  },
  teamStats: {
    playoff: [],
    season: [
      { name: "Goals per match", homeValue: "2.1", awayValue: "1.5", better: "home" },
      { name: "Goals conceded per match", homeValue: "1.4", awayValue: "0.9", better: "away" },
      { name: "Possession %", homeValue: "58%", awayValue: "47%", better: "home" },
      { name: "xG per match", homeValue: "1.9", awayValue: "1.4", better: "home" },
      { name: "Clean sheets", homeValue: "4", awayValue: "8", better: "away" },
    ],
  },
  h2h: {
    homeWins: 4,
    awayWins: 3,
    windowLabel: "Last 10 meetings (3 draws)",
    trend: "Tight series — 3 draws in the last 10. Miami unbeaten at home vs NYCFC since 2023.",
    games: [
      { date: "Apr 19, 2026", score: "1-1", location: "New York", winnerAbbr: "DRAW" },
      { date: "Sep 28, 2025", score: "MIA 2-1", location: "Fort Lauderdale", winnerAbbr: "MIA" },
      { date: "May 4, 2025", score: "NYC 3-1", location: "New York", winnerAbbr: "NYC" },
      { date: "Aug 24, 2024", score: "MIA 3-2", location: "Fort Lauderdale", winnerAbbr: "MIA" },
      { date: "Apr 13, 2024", score: "0-0", location: "New York", winnerAbbr: "DRAW" },
      { date: "Oct 7, 2023", score: "NYC 2-0", location: "New York", winnerAbbr: "NYC" },
      { date: "Jul 22, 2023", score: "MIA 2-0", location: "Fort Lauderdale", winnerAbbr: "MIA" },
      { date: "May 6, 2023", score: "2-2", location: "Fort Lauderdale", winnerAbbr: "DRAW" },
      { date: "Sep 17, 2022", score: "NYC 1-0", location: "New York", winnerAbbr: "NYC" },
      { date: "Jun 11, 2022", score: "MIA 1-0", location: "Fort Lauderdale", winnerAbbr: "MIA" },
    ],
  },
  players: [
    {
      name: "Luis Suárez", teamAbbr: "MIA", position: "ST",
      stats: [
        { label: "G", value: "9" }, { label: "A", value: "5" },
        { label: "xG", value: "8.2" }, { label: "SOT/90", value: "1.8" },
      ],
      note: "Miami's focal point in the box. 4 goals in his last 5 home matches.",
    },
    {
      name: "Santiago Rodríguez", teamAbbr: "NYC", position: "AM",
      stats: [
        { label: "G", value: "6" }, { label: "A", value: "7" },
        { label: "KP/90", value: "2.4" }, { label: "xA", value: "6.1" },
      ],
      note: "NYCFC's creative engine — involved in 13 of their 24 goals this season.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live injury feed",
    updated: "Jun 11, 2026, 11:00 AM ET",
    rows: [
      { player: "Jordi Alba", teamAbbr: "MIA", injury: "Calf tightness", status: "Questionable" },
      { player: "Matt Freese", teamAbbr: "NYC", injury: "No injuries reported", status: "Healthy" },
    ],
  },
  prediction: {
    winProbHome: 48.0,
    methodology:
      "Probability from xG-based team strength, home advantage, schedule congestion, and availability. Draw probability is significant in soccer (~26% here).",
    factors: [
      { icon: "🏠", name: "Home advantage", description: "Miami unbeaten at home vs NYCFC since 2023.", impact: 5 },
      { icon: "⚔️", name: "Attack vs low block", description: "NYCFC's compact away shape has frustrated possession teams all season.", impact: -4 },
      { icon: "🌡️", name: "Heat factor", description: "88°F kickoff favors the home side's acclimatization.", impact: 2 },
      { icon: "🤕", name: "Alba questionable", description: "Miami's width and left-side creation depend on him.", impact: -2 },
    ],
    pickAbbr: "MIA",
    pickTeamName: "Inter Miami CF",
    reasoning:
      "Slight home lean, but NYCFC's road defense makes the draw a live outcome — this is closer to a three-way coin flip than the records suggest.",
    confidence: "Low",
  },
  ats: [
    { label: "MIA vs spread", value: "8-8" },
    { label: "NYC vs spread", value: "9-7" },
    { label: "MIA home O/U 2.5", value: "Over 6-2" },
  ],
});

// ---------- UFC: fighters reuse the Team shape ----------

const MAK: Team = { id: "makhachev", name: "Islam Makhachev", shortName: "Makhachev", abbr: "IM", color: "#2e9e6b", record: "27-1-0" };
const TSA: Team = { id: "tsarukyan", name: "Arman Tsarukyan", shortName: "Tsarukyan", abbr: "AT", color: "#c0392b", record: "22-3-0" };

const makhachevTsarukyan: GameDetail = basicGame({
  id: "ufc-mak-tsa-2026-06-13",
  sport: "ufc",
  league: "UFC 322",
  slug: "makhachev-vs-tsarukyan-2-prediction-june-13-2026",
  home: MAK,
  away: TSA,
  status: "scheduled",
  startTimeLocal: "10:00 PM ET",
  startTimeUTC: "2026-06-13T02:00:00Z",
  dateLabel: "Jun 13, 2026",
  venue: "T-Mobile Arena",
  city: "Las Vegas, NV",
  broadcast: "ESPN+ PPV",
  winProbHome: 64.0,
  contextLabel: "UFC 322 · Lightweight Title · Main Event",
  overview: {
    recapTitle: "The rematch — 7 years in the making",
    recapStats: [
      { name: "Current win streak", homeValue: "15", awayValue: "5", better: "home" },
      { name: "Title fight experience", homeValue: "6 fights", awayValue: "1 fight", better: "home" },
      { name: "Age on fight night", homeValue: "34", awayValue: "29", better: "away" },
    ],
    storylines: [
      { team: "home", text: "<strong>The champion's gauntlet.</strong> Makhachev has defended the lightweight belt five times and hasn't lost since 2015 — a 15-fight win streak." },
      { team: "away", text: "<strong>Tsarukyan 2.0.</strong> Arman took Makhachev to a decision as a short-notice 22-year-old in 2019. Since then: 10-1 with wins over three top-5 lightweights." },
      { team: "away", text: "<strong>Youth and pace.</strong> Tsarukyan is 5 years younger and has fought twice as often over the last 18 months." },
      { team: "neutral", text: "<strong>Grappler vs grappler.</strong> Both men out-wrestle everyone else in the division — whoever is forced to strike first loses their A-game." },
    ],
  },
  teamStats: {
    playoff: [],
    season: [
      { name: "Sig. strikes landed / min", homeValue: "2.6", awayValue: "3.4", better: "away" },
      { name: "Striking accuracy", homeValue: "59%", awayValue: "55%", better: "home" },
      { name: "Strikes absorbed / min", homeValue: "1.1", awayValue: "1.9", better: "home" },
      { name: "Takedowns / 15 min", homeValue: "3.5", awayValue: "3.2", better: "home" },
      { name: "Takedown accuracy", homeValue: "65%", awayValue: "44%", better: "home" },
      { name: "Takedown defense", homeValue: "91%", awayValue: "85%", better: "home" },
      { name: "Submission attempts / 15", homeValue: "1.1", awayValue: "0.6", better: "home" },
      { name: "Avg fight time", homeValue: "11:42", awayValue: "13:05", better: "even" },
    ],
  },
  h2h: {
    homeWins: 1,
    awayWins: 0,
    windowLabel: "Head-to-head",
    trend:
      "Makhachev won the 2019 meeting by unanimous decision, but Tsarukyan — then 22 and on two weeks' notice — was the only opponent in a decade to stuff his early takedowns. Both fighters are dramatically different now.",
    games: [
      { date: "Apr 20, 2019", score: "UD 30-27 ×3", location: "St. Petersburg", winnerAbbr: "IM" },
    ],
  },
  players: [
    {
      name: "Islam Makhachev", teamAbbr: "IM", position: "Champion · Southpaw",
      stats: [
        { label: "W-L", value: "27-1" }, { label: "KO", value: "5" },
        { label: "SUB", value: "12" }, { label: "Reach", value: "70.5\"" },
      ],
      note: "Five title defenses. Control time leader in the division — averages 4:10 of control per fight.",
    },
    {
      name: "Arman Tsarukyan", teamAbbr: "AT", position: "Challenger · Orthodox",
      stats: [
        { label: "W-L", value: "22-3" }, { label: "KO", value: "10" },
        { label: "SUB", value: "5" }, { label: "Reach", value: "72\"" },
      ],
      note: "10-1 since the first Makhachev fight. More dangerous on the feet — 10 KOs and improving volume every camp.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live camp reports",
    updated: "Jun 11, 2026, 10:00 AM ET",
    rows: [
      { player: "Islam Makhachev", teamAbbr: "IM", injury: "Clean camp reported", status: "Healthy" },
      { player: "Arman Tsarukyan", teamAbbr: "AT", injury: "Clean camp; weight cut on track per team", status: "Healthy" },
    ],
  },
  prediction: {
    winProbHome: 64.0,
    methodology:
      "Probability blends grappling and striking differentials, shared-opponent results, age curves, title experience, and outcome of the first meeting.",
    factors: [
      { icon: "🤼", name: "Grappling edge", description: "65% takedown accuracy and 91% defense — Makhachev dictates where the fight happens.", impact: 8 },
      { icon: "🏆", name: "Title experience", description: "Six five-round title fights vs one for Tsarukyan. Championship rounds favor the champ.", impact: 4 },
      { icon: "📜", name: "First fight result", description: "Won the 2019 meeting, though it was competitive.", impact: 2 },
      { icon: "📈", name: "Tsarukyan's trajectory", description: "10-1 since 2019 with three top-5 wins; the gap has narrowed every year.", impact: -5 },
      { icon: "🎂", name: "Age curve", description: "29 vs 34 — Makhachev's wrestling-heavy style ages well, but speed favors Arman.", impact: -3 },
      { icon: "🥊", name: "Striking volume", description: "Tsarukyan lands 3.4/min with KO power; Makhachev absorbs little but strikes less.", impact: -2 },
    ],
    pickAbbr: "IM",
    pickTeamName: "Islam Makhachev",
    reasoning:
      "Tsarukyan is live — younger, higher volume, and the only man to make Makhachev's wrestling look human. But the champion's control game and five-round experience are still the most reliable skills in the division.",
    confidence: "Medium",
  },
  ats: [
    { label: "IM moneyline", value: "-185" },
    { label: "AT moneyline", value: "+160" },
    { label: "Goes to decision", value: "-120" },
    { label: "IM last 5 as favorite", value: "5-0" },
  ],
});

// ---------- World Cup 2026 (national teams reuse the Team shape) ----------

const USA: Team = { id: "usa", name: "United States", shortName: "USA", abbr: "USA", color: "#3c6fcd", record: "Group D" };
const PAR: Team = { id: "par", name: "Paraguay", shortName: "Paraguay", abbr: "PAR", color: "#cf4444", record: "Group D" };

const usaParaguay: GameDetail = basicGame({
  id: "wc-usa-par-2026-06-12",
  sport: "worldcup",
  league: "FIFA World Cup 2026",
  slug: "usa-vs-paraguay-prediction-world-cup-june-12-2026",
  home: USA,
  away: PAR,
  status: "scheduled",
  startTimeLocal: "9:00 PM ET",
  startTimeUTC: "2026-06-13T01:00:00Z",
  dateLabel: "Jun 12, 2026",
  venue: "SoFi Stadium",
  city: "Inglewood, CA",
  broadcast: "FOX / Telemundo",
  winProbHome: 54.0,
  contextLabel: "FIFA World Cup 2026 · Group D · Matchday 1",
  overview: {
    recapTitle: "Tournament opener — USMNT on home soil",
    recapStats: [
      { name: "Last 5 (W-D-L)", homeValue: "3-1-1", awayValue: "2-2-1", better: "home" },
      { name: "Goals scored (last 5)", homeValue: "9", awayValue: "6", better: "home" },
      { name: "Goals conceded (last 5)", homeValue: "5", awayValue: "4", better: "away" },
    ],
    storylines: [
      { team: "home", text: "<strong>A home World Cup.</strong> The USMNT opens the biggest tournament in history in front of 70,000 at SoFi — the first US men's World Cup match on home soil since 1994." },
      { team: "away", text: "<strong>Paraguay's defensive identity.</strong> La Albirroja qualified on the back of South America's stingiest defense after Argentina — compact lines and set-piece danger." },
      { team: "home", text: "<strong>Pulisic's moment.</strong> The captain enters off his best European club season and has been involved in a goal in 6 of his last 8 internationals." },
      { team: "neutral", text: "<strong>Group D stakes.</strong> With 48 teams, group winners draw a far easier knockout path — dropping points on matchday 1 is costly." },
    ],
  },
  teamStats: {
    playoff: [],
    season: [
      { name: "Goals per match", homeValue: "1.8", awayValue: "1.1", better: "home" },
      { name: "Goals conceded per match", homeValue: "1.0", awayValue: "0.8", better: "away" },
      { name: "Possession %", homeValue: "55%", awayValue: "44%", better: "home" },
      { name: "xG per match", homeValue: "1.7", awayValue: "1.0", better: "home" },
      { name: "Clean sheets (last 10)", homeValue: "4", awayValue: "5", better: "away" },
    ],
  },
  h2h: {
    homeWins: 5,
    awayWins: 1,
    windowLabel: "Last 8 meetings (2 draws)",
    trend:
      "The US has dominated this fixture recently, but Paraguay's lone win came in a competitive match. All US wins were by a single goal — expect a tight, physical game.",
    games: [
      { date: "Nov 18, 2025", score: "USA 2-1", location: "Friendly", winnerAbbr: "USA" },
      { date: "Mar 24, 2024", score: "1-1", location: "Friendly", winnerAbbr: "DRAW" },
      { date: "Sep 27, 2022", score: "USA 1-0", location: "Friendly", winnerAbbr: "USA" },
      { date: "Jun 11, 2019", score: "USA 1-0", location: "Friendly", winnerAbbr: "USA" },
      { date: "Mar 27, 2018", score: "USA 1-0", location: "Friendly", winnerAbbr: "USA" },
      { date: "Jun 11, 2016", score: "USA 1-0", location: "Copa América", winnerAbbr: "USA" },
      { date: "Jun 26, 2011", score: "0-0", location: "Friendly", winnerAbbr: "DRAW" },
      { date: "Mar 29, 2011", score: "PAR 1-0", location: "Friendly", winnerAbbr: "PAR" },
    ],
  },
  players: [
    {
      name: "Christian Pulisic", teamAbbr: "USA", position: "LW · Captain",
      stats: [
        { label: "G", value: "12" }, { label: "A", value: "9" },
        { label: "Caps", value: "81" }, { label: "xG+xA/90", value: "0.9" },
      ],
      note: "Goal involvement in 6 of his last 8 internationals. Paraguay will double-team him wide left.",
    },
    {
      name: "Folarin Balogun", teamAbbr: "USA", position: "ST",
      stats: [
        { label: "G", value: "9" }, { label: "SOT/90", value: "1.6" },
        { label: "Caps", value: "32" }, { label: "xG/90", value: "0.6" },
      ],
      note: "The line-leader against a deep block — his runs in behind are the USMNT's best route past Paraguay's back five.",
    },
    {
      name: "Miguel Almirón", teamAbbr: "PAR", position: "AM",
      stats: [
        { label: "G", value: "7" }, { label: "A", value: "5" },
        { label: "Caps", value: "68" }, { label: "KP/90", value: "1.9" },
      ],
      note: "Paraguay's transition outlet. Dangerous on the counter — exactly the kind of game state this match could produce.",
    },
    {
      name: "Julio Enciso", teamAbbr: "PAR", position: "FW",
      stats: [
        { label: "G", value: "6" }, { label: "A", value: "4" },
        { label: "Caps", value: "41" }, { label: "Drb/90", value: "2.3" },
      ],
      note: "X-factor off the right. Set-piece taker — Paraguay scored 40% of qualifying goals from dead balls.",
    },
  ],
  injuries: {
    source: "Sample data — wire to live camp reports",
    updated: "Jun 12, 2026, 12:00 PM ET",
    rows: [
      { player: "Christian Pulisic", teamAbbr: "USA", injury: "Fully fit", status: "Healthy" },
      { player: "Tyler Adams", teamAbbr: "USA", injury: "Hamstring — managed minutes expected", status: "Questionable" },
      { player: "Miguel Almirón", teamAbbr: "PAR", injury: "Fully fit", status: "Healthy" },
      { player: "Gustavo Gómez", teamAbbr: "PAR", injury: "Suspended (yellow card accumulation)", status: "Out" },
    ],
  },
  prediction: {
    winProbHome: 54.0,
    methodology:
      "Probability from xG-based team strength, FIFA ranking gap, home advantage, and availability. Draws are common in World Cup openers (~27% here).",
    factors: [
      { icon: "🏟️", name: "True home World Cup match", description: "70,000 at SoFi behind the USMNT — host nations historically outperform in openers.", impact: 6 },
      { icon: "📊", name: "Quality edge", description: "USA's xG and talent pool outrank Paraguay's on paper.", impact: 4 },
      { icon: "🧱", name: "Paraguay's low block", description: "Breaking down a back five is the USMNT's historic weakness — all recent wins in this fixture were 1-goal games.", impact: -4 },
      { icon: "🤕", name: "Adams managed", description: "Midfield destroyer on a minutes limit weakens counter-press protection.", impact: -2 },
      { icon: "⚽", name: "Set-piece threat", description: "Paraguay scored 40% of qualifying goals from dead balls; openers are nervy.", impact: -2 },
    ],
    pickAbbr: "USA",
    pickTeamName: "United States",
    reasoning:
      "The US should control the game, but Paraguay's structure makes this a grind. Slight USA lean with a real draw risk — 1-0 or 2-1 profile, likely decided after halftime.",
    confidence: "Low",
  },
  ats: [
    { label: "USA moneyline", value: "-130" },
    { label: "Draw", value: "+240" },
    { label: "PAR moneyline", value: "+420" },
    { label: "Under 2.5 goals", value: "-150" },
  ],
});

export const GAMES: GameDetail[] = [
  knicksSpurs,
  usaParaguay,
  oilersPanthers,
  makhachevTsarukyan,
  yankeesRedSox,
  dodgersPadres,
  miamiNycfc,
];

export const FEATURED_GAME_ID = knicksSpurs.id;

export function toSummary(g: GameDetail): GameSummary {
  // GameDetail extends GameSummary; return as-is (summary fields are a subset).
  return g;
}
