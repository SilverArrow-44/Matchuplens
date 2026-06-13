import type { GameDetail } from "./types";

// ----------------------------------------------------------------------------
// Builds data-driven matchup analysis paragraphs from a GameDetail.
// Used on game pages for SEO-friendly long-form content — no AI needed,
// just structured templates filled with real game data.
// ----------------------------------------------------------------------------

function sportNoun(sport: string): string {
  if (sport === "ufc") return "bout";
  if (sport === "soccer" || sport === "worldcup") return "match";
  if (sport === "mlb") return "game";
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
  const parts = record.split("-").map((n) => parseInt(n, 10));
  if (parts.length < 2 || parts.some(isNaN)) return null;
  return { w: parts[0], l: parts[1] };
}

function stronger(record: string): "strong" | "solid" | "struggling" {
  const r = parseRecord(record);
  if (!r) return "solid";
  const pct = r.w / (r.w + r.l);
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

export function buildMatchupAnalysis(game: GameDetail): MatchupAnalysis {
  const noun = sportNoun(game.sport);
  const verb = tippingVerb(game.sport);
  const homeStrength = stronger(game.home.record);
  const awayStrength = stronger(game.away.record);
  const probHome = game.winProbHome.toFixed(1);
  const probAway = (100 - game.winProbHome).toFixed(1);
  const favorite = game.winProbHome >= 50 ? game.home : game.away;
  const underdog = game.winProbHome >= 50 ? game.away : game.home;
  const favProb = game.winProbHome >= 50 ? probHome : probAway;
  const margin = Math.abs(game.winProbHome - 50);

  // --- Overview ---
  const closenessNote =
    margin < 7
      ? "This is a toss-up — neither side holds a meaningful edge."
      : margin < 15
        ? "The edge is real but slim; an upset is well within range."
        : "The model sees a clear edge here, though upsets always happen in sports.";

  const overview = [
    `${game.away.name} (${game.away.record}) travel to face ${game.home.name} (${game.home.record}) in a ${game.contextLabel ?? game.league} ${noun} at ${game.venue}${game.city ? `, ${game.city}` : ""}.`,
    `${game.home.abbr} ${verb} at ${game.startTimeLocal} on ${game.broadcast}.`,
    `Our model gives ${game.home.abbr} a ${probHome}% chance to win and ${game.away.abbr} a ${probAway}% chance.`,
    closenessNote,
  ].join(" ");

  // --- Why home can win ---
  const homeFactors: string[] = [];
  if (homeStrength === "strong")
    homeFactors.push(
      `${game.home.shortName} enter with one of the better records in their division at ${game.home.record}`
    );
  else if (homeStrength === "solid")
    homeFactors.push(
      `${game.home.shortName} bring a respectable ${game.home.record} record into this ${noun}`
    );
  else
    homeFactors.push(
      `Despite a ${game.home.record} record, ${game.home.shortName} retain home-court advantage`
    );

  const homePredFactor = game.prediction.factors.find(
    (f) => f.impact > 0 && f.name !== "Home advantage"
  );
  if (homePredFactor)
    homeFactors.push(
      `${homePredFactor.description.replace(/\.$/, "")}, giving them a statistical edge`
    );

  homeFactors.push(
    `playing at home — teams win roughly 55-60% of games on their own floor or field`
  );

  if (game.h2h.homeWins > game.h2h.awayWins)
    homeFactors.push(
      `${game.home.shortName} also lead the head-to-head series ${game.h2h.homeWins}–${game.h2h.awayWins} in recent meetings`
    );

  const whyHome = `Why ${game.home.name} can win: ${homeFactors[0]}. ${homeFactors
    .slice(1)
    .map((f, i) => (i === 0 ? f.charAt(0).toUpperCase() + f.slice(1) + "." : f + "."))
    .join(" ")}`;

  // --- Why away can win ---
  const awayFactors: string[] = [];
  if (awayStrength === "strong")
    awayFactors.push(
      `${game.away.shortName} are one of the better teams in the league this season at ${game.away.record}`
    );
  else if (awayStrength === "solid")
    awayFactors.push(
      `${game.away.shortName} are a .500-or-better team at ${game.away.record} and capable of winning on the road`
    );
  else
    awayFactors.push(
      `${game.away.shortName} are ${game.away.record} this season but road games can be equalizers`
    );

  const awayPredFactor = game.prediction.factors.find(
    (f) => f.impact < 0
  );
  if (awayPredFactor)
    awayFactors.push(
      `the model notes: ${awayPredFactor.description.replace(/\.$/, "").toLowerCase()}`
    );

  if (game.h2h.awayWins > game.h2h.homeWins)
    awayFactors.push(
      `${game.away.shortName} hold a ${game.h2h.awayWins}–${game.h2h.homeWins} head-to-head advantage in recent matchups`
    );

  const whyAway = `Why ${game.away.name} can win: ${awayFactors[0]}. ${awayFactors
    .slice(1)
    .map((f, i) => (i === 0 ? f.charAt(0).toUpperCase() + f.slice(1) + "." : f + "."))
    .join(" ")}`;

  // --- Betting context ---
  const marketFactor = game.prediction.factors.find(
    (f) => f.name === "Betting market"
  );
  const spreadFactor = game.prediction.factors.find(
    (f) => f.name === "Point spread"
  );
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
  const edgeWord =
    margin >= 15
      ? "clear"
      : margin >= 7
        ? "moderate"
        : "slim";
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
