import type { Prediction, PredictionFactor, Team } from "./types";

// ----------------------------------------------------------------------------
// Heuristic prediction engine.
// Builds a win probability + factor breakdown from whatever live data is
// available (records, moneylines, home court). When you're ready, this is
// the natural place to swap in a Claude API call for richer reasoning.
// ----------------------------------------------------------------------------

function winPctFromRecord(record: string): number | null {
  // "53-29" or "49-27-6"
  const parts = record.split("-").map((n) => parseInt(n, 10));
  if (parts.length < 2 || parts.some(isNaN)) return null;
  const [w, l, t = 0] = parts;
  const games = w + l + t;
  if (!games) return null;
  return (w + t * 0.5) / games;
}

export function moneylineToProb(ml: number): number {
  return ml < 0 ? -ml / (-ml + 100) : 100 / (ml + 100);
}

export interface PredictInput {
  home: Team;
  away: Team;
  homeMoneyline?: number;
  awayMoneyline?: number;
  oddsDetails?: string; // "NY -3.5"
  neutralSite?: boolean;
  isFight?: boolean;
}

export function buildPrediction(input: PredictInput): Prediction {
  const { home, away } = input;
  const factors: PredictionFactor[] = [];
  let prob = 50;

  // 1. Betting market (strongest signal when available)
  if (input.homeMoneyline != null && input.awayMoneyline != null) {
    const ph = moneylineToProb(input.homeMoneyline);
    const pa = moneylineToProb(input.awayMoneyline);
    const market = (ph / (ph + pa)) * 100;
    const shift = Math.round(market - 50);
    prob = market;
    factors.push({
      icon: "💰",
      name: "Betting market",
      description: `Sportsbook moneylines (${input.homeMoneyline > 0 ? "+" : ""}${input.homeMoneyline} / ${input.awayMoneyline > 0 ? "+" : ""}${input.awayMoneyline}) imply ${market.toFixed(0)}% for ${home.abbr}.`,
      impact: shift,
    });
  } else {
    // 2. Record differential
    const hw = winPctFromRecord(home.record);
    const aw = winPctFromRecord(away.record);
    if (hw != null && aw != null) {
      const shift = Math.round((hw - aw) * 40); // ±40 pts max swing
      prob += shift;
      factors.push({
        icon: "📊",
        name: "Season records",
        description: `${home.abbr} ${home.record} vs ${away.abbr} ${away.record}.`,
        impact: shift,
      });
    }
    // 3. Home advantage
    if (!input.neutralSite && !input.isFight) {
      prob += 5;
      factors.push({
        icon: "🏠",
        name: "Home advantage",
        description: "Home teams win roughly 55-60% of games across major sports.",
        impact: 5,
      });
    }
  }

  if (input.oddsDetails) {
    factors.push({
      icon: "📈",
      name: "Point spread",
      description: `Current line: ${input.oddsDetails}.`,
      impact: 0,
    });
  }

  prob = Math.max(8, Math.min(92, prob));
  const pickHome = prob >= 50;
  const pick = pickHome ? home : away;
  const margin = Math.abs(prob - 50);

  return {
    winProbHome: Math.round(prob * 10) / 10,
    methodology:
      "Win probability derived from sportsbook moneylines when available, otherwise from season records plus home advantage. Factor weights are heuristic — refine as more data sources come online.",
    factors,
    pickAbbr: pick.abbr,
    pickTeamName: pick.name,
    reasoning: pickHome
      ? `${home.shortName} ${input.isFight ? "is" : "are"} favored${input.neutralSite ? "" : " at home"}${margin < 8 ? ", but this projects close — treat it as a lean, not a certainty" : ""}.`
      : `${away.shortName} ${input.isFight ? "is" : "are"} favored despite ${input.neutralSite || input.isFight ? "the matchup context" : "playing on the road"}${margin < 8 ? " — a narrow edge" : ""}.`,
    confidence: margin >= 15 ? "High" : margin >= 7 ? "Medium" : "Low",
  };
}
