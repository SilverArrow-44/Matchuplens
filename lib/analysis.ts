import type { GameDetail } from "./types";

// ----------------------------------------------------------------------------
// Builds data-driven matchup analysis paragraphs from a GameDetail.
// Used on game pages for SEO-friendly long-form content.
// Sport-specific templates: team sports, soccer/World Cup, UFC.
// ----------------------------------------------------------------------------

function sportNoun(sport: string): string {
  if (sport === "ufc") return "bout";
  if (sport === "soccer" || sport === "worldcup") return "match";
  return "game";
}

function tippingVerb(sport: string): string {
  if (sport === "nba") return "tips off";
  if (sport === "nfl") return "kicks off";
  if (sport === "mlb") return "first pitch is";
  if (sport === "nhl") return "drops the puck";
  if (sport === "ufc") return "gets underway";
  return "starts";
}

function parseRecord(record: string): { w: number; l: number } | null {
  if (!record || record.trim() === "") return null;
  const parts = record.split("-").map((n) => parseInt(n, 10));
  if (parts.length < 2 || parts.some(isNaN)) return null;
  return { w: parts[0], l: parts[1] };
}

/** True if the record string is usable (non-empty, valid format) */
function hasRecord(record: string): boolean {
  return parseRecord(record) !== null;
}

function winPct(record: string): number | null {
  const r = parseRecord(record);
  if (!r || r.w + r.l === 0) return null;
  return r.w / (r.w + r.l);
}

function strength(record: string): "strong" | "solid" | "struggling" | "unknown" {
  const pct = winPct(record);
  if (pct === null) return "unknown";
  if (pct >= 0.6) return "strong";
  if (pct >= 0.45) return "solid";
  return "struggling";
}

export interface MatchupAnalysis {
  overview: string;
  whyHome: string;
  whyAway: string;
  bettingContext: string | null;
  predictionSummary: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UFC builder — fighter-specific language, no "home floor" nonsense
// ─────────────────────────────────────────────────────────────────────────────
function buildUfcAnalysis(game: GameDetail): MatchupAnalysis {
  const probHome = game.winProbHome.toFixed(1);
  const probAway = (100 - game.winProbHome).toFixed(1);
  const favorite = game.winProbHome >= 50 ? game.home : game.away;
  const underdog = game.winProbHome >= 50 ? game.away : game.home;
  const favProb = game.winProbHome >= 50 ? probHome : probAway;
  const margin = Math.abs(game.winProbHome - 50);

  const overview = [
    `${game.away.name} meets ${game.home.name} in a ${game.contextLabel ?? game.league} ${sportNoun(game.sport)} at ${game.venue}${game.city ? `, ${game.city}` : ""}.`,
    `The contest ${tippingVerb(game.sport)} at ${game.startTimeLocal} on ${game.broadcast}.`,
    `Our model currently gives ${game.home.abbr} a ${probHome}% win probability and ${game.away.abbr} a ${probAway}% chance.`,
    margin < 7
      ? "This is a razor-thin matchup — model confidence is low and either fighter can win."
      : margin < 15
        ? "The model sees a slight edge, but MMA is volatile and upsets are frequent."
        : "The model sees a clear edge here, though any single punch can change an MMA fight.",
  ].join(" ");

  const homePredFactor = game.prediction.factors.find((f) => f.impact > 0 && f.name !== "Home advantage");
  const awayPredFactor = game.prediction.factors.find((f) => f.impact < 0);

  const whyHome = [
    `Why ${game.home.name} can win: `,
    hasRecord(game.home.record)
      ? `${game.home.shortName} carries a ${game.home.record} record into this fight.`
      : `${game.home.shortName} is entering this fight with momentum.`,
    homePredFactor
      ? ` ${homePredFactor.description.replace(/\.$/, "")} gives them a statistical lean.`
      : "",
    game.h2h.homeWins > game.h2h.awayWins
      ? ` ${game.home.shortName} also leads the head-to-head series ${game.h2h.homeWins}–${game.h2h.awayWins}.`
      : "",
  ].join("");

  const whyAway = [
    `Why ${game.away.name} can win: `,
    hasRecord(game.away.record)
      ? `${game.away.shortName} enters at ${game.away.record}.`
      : `${game.away.shortName} arrives with competitive credentials.`,
    awayPredFactor
      ? ` The model notes: ${awayPredFactor.description.replace(/\.$/, "").toLowerCase()}.`
      : "",
    game.h2h.awayWins > game.h2h.homeWins
      ? ` ${game.away.shortName} holds a ${game.h2h.awayWins}–${game.h2h.homeWins} advantage in prior meetings.`
      : "",
    ` MMA finishes can come from anywhere — style mismatches often override record-based models.`,
  ].join("");

  const marketFactor = game.prediction.factors.find((f) => f.name === "Betting market");
  const bettingContext = marketFactor
    ? `${marketFactor.description.replace(/\.$/, "")}. Betting market information is provided for context only — not betting advice. Wager responsibly and only where legal.`
    : null;

  const edgeWord = margin >= 15 ? "clear" : margin >= 7 ? "moderate" : "slim";
  const predictionSummary = [
    `MatchupLens makes ${favorite.name} the ${edgeWord} model favorite at ${favProb}% win probability.`,
    `${underdog.shortName} are given a ${Math.min(game.winProbHome, 100 - game.winProbHome).toFixed(1)}% chance.`,
    game.prediction.confidence === "High"
      ? "High model confidence."
      : game.prediction.confidence === "Medium"
        ? "Medium confidence — treat this as a lean, not a certainty."
        : "Low confidence — this is a close fight by the model's inputs.",
    `Predictions are editorial analysis for entertainment only — not betting advice.`,
  ].join(" ");

  return { overview, whyHome, whyAway, bettingContext, predictionSummary };
}

// ─────────────────────────────────────────────────────────────────────────────
// Soccer / World Cup builder — draw-aware, no "home floor" language
// ─────────────────────────────────────────────────────────────────────────────
function buildSoccerAnalysis(game: GameDetail): MatchupAnalysis {
  const probHome = game.winProbHome.toFixed(1);
  const probAway = (100 - game.winProbHome).toFixed(1);
  const favorite = game.winProbHome >= 50 ? game.home : game.away;
  const underdog = game.winProbHome >= 50 ? game.away : game.home;
  const favProb = game.winProbHome >= 50 ? probHome : probAway;
  const margin = Math.abs(game.winProbHome - 50);
  const noun = sportNoun(game.sport);

  const overview = [
    `${game.away.name}${hasRecord(game.away.record) ? ` (${game.away.record})` : ""} faces ${game.home.name}${hasRecord(game.home.record) ? ` (${game.home.record})` : ""} in a ${game.contextLabel ?? game.league} ${noun} at ${game.venue}${game.city ? `, ${game.city}` : ""}.`,
    `Kickoff ${tippingVerb(game.sport)} at ${game.startTimeLocal} on ${game.broadcast}.`,
    `Our model gives ${game.home.abbr} a ${probHome}% win probability and ${game.away.abbr} a ${probAway}% chance.`,
    `Note: this model estimates win/loss probability only — draw probability in soccer is not separately modeled. Real-world draw odds from sportsbooks will differ.`,
    margin < 7
      ? "This looks like a tight contest on paper."
      : margin < 15
        ? "There is a real edge here, though soccer results are highly variable."
        : "The model favors one side clearly, though any match can finish level.",
  ].join(" ");

  const homeFactors: string[] = [];
  const hs = strength(game.home.record);
  if (hs === "strong")
    homeFactors.push(`${game.home.shortName} carry an impressive record${hasRecord(game.home.record) ? ` of ${game.home.record}` : ""} into this ${noun}`);
  else if (hs === "solid")
    homeFactors.push(`${game.home.shortName} arrive in decent form${hasRecord(game.home.record) ? ` at ${game.home.record}` : ""}`);
  else if (hs === "struggling")
    homeFactors.push(`${game.home.shortName} are ${game.home.record} but home matches offer additional motivation`);
  else
    homeFactors.push(`${game.home.shortName} have home-match advantage and the support of their crowd`);

  const homePredFactor = game.prediction.factors.find((f) => f.impact > 0 && f.name !== "Home advantage");
  if (homePredFactor) homeFactors.push(`${homePredFactor.description.replace(/\.$/, "")}`);
  if (game.h2h.homeWins > game.h2h.awayWins)
    homeFactors.push(`${game.home.shortName} lead the H2H series ${game.h2h.homeWins}–${game.h2h.awayWins}`);

  const whyHome = `Why ${game.home.name} can win: ${homeFactors.join(". ")}.`;

  const awayFactors: string[] = [];
  const as_ = strength(game.away.record);
  if (as_ === "strong")
    awayFactors.push(`${game.away.shortName} come in as one of the stronger sides${hasRecord(game.away.record) ? ` at ${game.away.record}` : ""}`);
  else if (as_ === "solid")
    awayFactors.push(`${game.away.shortName} are in solid form${hasRecord(game.away.record) ? ` at ${game.away.record}` : ""}`);
  else if (as_ === "struggling")
    awayFactors.push(`${game.away.shortName} are ${game.away.record} but away sides often play with freedom`);
  else
    awayFactors.push(`${game.away.shortName} can be dangerous opponents regardless of form`);

  const awayPredFactor = game.prediction.factors.find((f) => f.impact < 0);
  if (awayPredFactor) awayFactors.push(`the model notes: ${awayPredFactor.description.replace(/\.$/, "").toLowerCase()}`);
  if (game.h2h.awayWins > game.h2h.homeWins)
    awayFactors.push(`${game.away.shortName} have the edge in recent meetings at ${game.h2h.awayWins}–${game.h2h.homeWins}`);
  awayFactors.push(`a draw is always possible in football and would deny both sides a win`);

  const whyAway = `Why ${game.away.name} can win (or draw): ${awayFactors.join(". ")}.`;

  const marketFactor = game.prediction.factors.find((f) => f.name === "Betting market");
  const bettingContext = marketFactor
    ? `${marketFactor.description.replace(/\.$/, "")}. Sportsbooks price three outcomes (home win, draw, away win) — this model only estimates two-outcome probability. Betting market information is provided for context only — not betting advice.`
    : null;

  const edgeWord = margin >= 15 ? "clear" : margin >= 7 ? "moderate" : "slim";
  const predictionSummary = [
    `MatchupLens makes ${favorite.name} the ${edgeWord} favorite at ${favProb}% win probability (draw not modeled).`,
    `${underdog.shortName} are given a ${Math.min(game.winProbHome, 100 - game.winProbHome).toFixed(1)}% chance.`,
    game.prediction.confidence === "High"
      ? "The model has high confidence in this call."
      : game.prediction.confidence === "Medium"
        ? "Medium confidence — treat this as a lean. Draws are always in play in soccer."
        : "Low confidence — the match looks very open.",
    `Predictions are editorial analysis for entertainment only — not betting advice.`,
  ].join(" ");

  return { overview, whyHome, whyAway, bettingContext, predictionSummary };
}

// ─────────────────────────────────────────────────────────────────────────────
// Team sports builder (NBA / NFL / MLB / NHL / NCAAF / NCAAB)
// ─────────────────────────────────────────────────────────────────────────────
function buildTeamSportsAnalysis(game: GameDetail): MatchupAnalysis {
  const noun = sportNoun(game.sport);
  const verb = tippingVerb(game.sport);
  const probHome = game.winProbHome.toFixed(1);
  const probAway = (100 - game.winProbHome).toFixed(1);
  const favorite = game.winProbHome >= 50 ? game.home : game.away;
  const underdog = game.winProbHome >= 50 ? game.away : game.home;
  const favProb = game.winProbHome >= 50 ? probHome : probAway;
  const margin = Math.abs(game.winProbHome - 50);

  const homeHasRecord = hasRecord(game.home.record);
  const awayHasRecord = hasRecord(game.away.record);

  // --- Overview ---
  const teamDescHome = homeHasRecord ? ` (${game.home.record})` : "";
  const teamDescAway = awayHasRecord ? ` (${game.away.record})` : "";

  const closenessNote =
    margin < 7
      ? "This is a toss-up — neither side holds a meaningful edge."
      : margin < 15
        ? "The edge is real but slim; an upset is well within range."
        : "The model sees a clear edge here, though upsets always happen in sports.";

  const overview = [
    `${game.away.name}${teamDescAway} travel to face ${game.home.name}${teamDescHome} in a ${game.contextLabel ?? game.league} ${noun} at ${game.venue}${game.city ? `, ${game.city}` : ""}.`,
    !homeHasRecord && !awayHasRecord
      ? `Season record data is not yet available for this matchup, so the model leans on venue, market line, and baseline team strength.`
      : "",
    `${game.home.abbr} ${verb} at ${game.startTimeLocal} on ${game.broadcast}.`,
    `Our model gives ${game.home.abbr} a ${probHome}% chance to win and ${game.away.abbr} a ${probAway}% chance.`,
    closenessNote,
  ].filter(Boolean).join(" ");

  // --- Why home can win ---
  const homeFactors: string[] = [];
  const hs = strength(game.home.record);

  if (hs === "strong")
    homeFactors.push(`${game.home.shortName} enter with one of the better records in their division${homeHasRecord ? ` at ${game.home.record}` : ""}`);
  else if (hs === "solid")
    homeFactors.push(`${game.home.shortName} bring a respectable${homeHasRecord ? ` ${game.home.record}` : ""} record into this ${noun}`);
  else if (hs === "struggling")
    homeFactors.push(`Despite a${homeHasRecord ? ` ${game.home.record}` : ""} record, ${game.home.shortName} retain the home-court edge`);
  else
    homeFactors.push(`${game.home.shortName} have home advantage on their side`);

  const homePredFactor = game.prediction.factors.find((f) => f.impact > 0 && f.name !== "Home advantage");
  if (homePredFactor)
    homeFactors.push(`${homePredFactor.description.replace(/\.$/, "")}, giving them a statistical edge`);

  // Sport-appropriate home advantage phrasing
  const homeVenueNote =
    game.sport === "nba" || game.sport === "ncaab"
      ? "home teams win roughly 58% of games in basketball"
      : game.sport === "nfl" || game.sport === "ncaaf"
        ? "home teams hold a proven edge in football"
        : game.sport === "mlb"
          ? "home teams win roughly 54% of MLB games"
          : game.sport === "nhl"
            ? "home teams win roughly 55% of NHL games"
            : "home advantage is a real factor here";
  homeFactors.push(homeVenueNote);

  if (game.h2h.homeWins > game.h2h.awayWins)
    homeFactors.push(
      `${game.home.shortName} also lead the head-to-head series ${game.h2h.homeWins}–${game.h2h.awayWins} in recent meetings`
    );

  const whyHome = `Why ${game.home.name} can win: ${homeFactors[0]}. ${homeFactors
    .slice(1)
    .map((f) => f.charAt(0).toUpperCase() + f.slice(1) + ".")
    .join(" ")}`;

  // --- Why away can win ---
  const awayFactors: string[] = [];
  const as_ = strength(game.away.record);

  if (as_ === "strong")
    awayFactors.push(`${game.away.shortName} are one of the better teams in the league this season${awayHasRecord ? ` at ${game.away.record}` : ""}`);
  else if (as_ === "solid")
    awayFactors.push(`${game.away.shortName} are a .500-or-better team${awayHasRecord ? ` at ${game.away.record}` : ""} and capable of winning on the road`);
  else if (as_ === "struggling")
    awayFactors.push(`${game.away.shortName} are${awayHasRecord ? ` ${game.away.record}` : ""} this season but road games can serve as equalizers`);
  else
    awayFactors.push(`${game.away.shortName} bring competitive motivation as the road team`);

  const awayPredFactor = game.prediction.factors.find((f) => f.impact < 0);
  if (awayPredFactor)
    awayFactors.push(`the model notes: ${awayPredFactor.description.replace(/\.$/, "").toLowerCase()}`);

  if (game.h2h.awayWins > game.h2h.homeWins)
    awayFactors.push(
      `${game.away.shortName} hold a ${game.h2h.awayWins}–${game.h2h.homeWins} head-to-head advantage in recent matchups`
    );

  const whyAway = `Why ${game.away.name} can win: ${awayFactors[0]}. ${awayFactors
    .slice(1)
    .map((f) => f.charAt(0).toUpperCase() + f.slice(1) + ".")
    .join(" ")}`;

  // --- Betting context ---
  const marketFactor = game.prediction.factors.find((f) => f.name === "Betting market");
  const spreadFactor = game.prediction.factors.find((f) => f.name === "Point spread");
  let bettingContext: string | null = null;
  if (marketFactor || spreadFactor) {
    const parts: string[] = [];
    if (marketFactor) parts.push(marketFactor.description.replace(/\.$/, ""));
    if (spreadFactor)
      parts.push(`The current point spread is ${spreadFactor.description.replace("Current line: ", "").replace(/\.$/, "")}`);
    parts.push(
      "Betting market information is provided for context only — this is not betting advice. Always wager responsibly and only where legal."
    );
    bettingContext = parts.join(". ") + ".";
  }

  // --- Prediction summary ---
  const edgeWord = margin >= 15 ? "clear" : margin >= 7 ? "moderate" : "slim";
  const confidenceNote =
    game.prediction.confidence === "High"
      ? "The model has high confidence in this call."
      : game.prediction.confidence === "Medium"
        ? "The model has medium confidence — treat this as a lean, not a lock."
        : "Low confidence — this projects close and either team could win.";

  const predictionSummary = [
    `MatchupLens makes ${favorite.name} the ${edgeWord} favorite with a ${Math.max(game.winProbHome, 100 - game.winProbHome).toFixed(1)}% win probability.`,
    `${underdog.shortName} are given a ${Math.min(game.winProbHome, 100 - game.winProbHome).toFixed(1)}% chance to pull the upset.`,
    confidenceNote,
    `Predictions are editorial analysis for entertainment only — not betting advice.`,
  ].join(" ");

  return { overview, whyHome, whyAway, bettingContext, predictionSummary };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public entry point — routes to the right template by sport
// ─────────────────────────────────────────────────────────────────────────────
export function buildMatchupAnalysis(game: GameDetail): MatchupAnalysis {
  if (game.sport === "ufc") return buildUfcAnalysis(game);
  if (game.sport === "soccer" || game.sport === "worldcup") return buildSoccerAnalysis(game);
  return buildTeamSportsAnalysis(game);
}
