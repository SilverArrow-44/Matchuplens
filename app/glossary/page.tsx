import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sports Stats & Betting Glossary — Terms Explained",
  description:
    "A plain-English glossary of the sports analytics and betting-market terms used across MatchupLens: win probability, moneyline, point spread, over/under, implied probability, vig, ATS, push, and more.",
  alternates: { canonical: "https://matchuplens.com/glossary" },
};

const TERMS: { term: string; def: React.ReactNode }[] = [
  {
    term: "Win probability",
    def: "An estimate of how likely a team is to win a given game, shown as a percentage. On MatchupLens it's derived from the betting market when available, otherwise from team records plus home advantage.",
  },
  {
    term: "Moneyline",
    def: "A bet (or price) on which team wins outright, with no point spread. Negative numbers (e.g. −150) mark the favorite and show how much you'd stake to win $100; positive numbers (e.g. +130) mark the underdog and show the profit on a $100 stake.",
  },
  {
    term: "Implied probability",
    def: "The win chance baked into a betting price. A −150 moneyline implies roughly a 60% chance; +130 implies about 43%. We convert moneylines to implied probability to build our estimate.",
  },
  {
    term: "Point spread",
    def: "A margin set by sportsbooks to level a matchup. A team listed at −6.5 must win by 7+ to 'cover'; a team at +6.5 covers by losing by 6 or fewer, or winning outright.",
  },
  {
    term: "Over/Under (total)",
    def: "The combined number of points/goals/runs both teams are projected to score. You can bet whether the actual total finishes over or under that line.",
  },
  {
    term: "Vig (juice)",
    def: "The built-in margin a sportsbook charges, which makes the two sides of a market add up to more than 100%. We remove the vig when converting a line into a clean win-probability estimate.",
  },
  {
    term: "ATS (against the spread)",
    def: "How a team performs relative to the point spread rather than just win-loss. A heavy favorite can win the game but still fail to cover ATS.",
  },
  {
    term: "Push",
    def: "A tie against the betting line — for example, a team favored by exactly 6 that wins by exactly 6. Pushed bets are typically refunded.",
  },
  {
    term: "Favorite / Underdog",
    def: "The favorite is the team more likely to win (shorter odds); the underdog is the less likely side (longer odds, bigger potential payout).",
  },
  {
    term: "Head-to-head (H2H)",
    def: "The history of past meetings between two teams. Recent H2H results can hint at stylistic matchups, though they don't guarantee future outcomes.",
  },
  {
    term: "Home advantage",
    def: "The measurable edge teams tend to have at home, from crowd support to travel and familiarity. Its size varies by sport and isn't applied at neutral-site games or individual combat sports.",
  },
  {
    term: "Neutral site",
    def: "A venue that isn't the home ground of either team — common in tournaments like the World Cup or championship games. Home advantage doesn't apply.",
  },
  {
    term: "Confidence level",
    def: "MatchupLens labels each pick High, Medium, or Low based on how far the favorite's win probability sits from 50/50. It reflects model certainty, not a promise of accuracy.",
  },
  {
    term: "Group stage",
    def: "The opening round-robin phase of a tournament (e.g. the World Cup), where teams in a group each play one another and the top finishers advance to the knockout rounds.",
  },
  {
    term: "Knockout round",
    def: "A single-elimination stage where the loser is out. In soccer, tied knockout matches go to extra time and, if needed, a penalty shootout.",
  },
  {
    term: "Parlay",
    def: "A single bet that combines multiple selections; every leg must win for the parlay to pay. Higher potential payout, much lower probability — the risk compounds with each leg.",
  },
  {
    term: "Live (in-play)",
    def: "A game currently in progress. Scores and, on some markets, odds update in real time while play is ongoing.",
  },
];

export default function GlossaryPage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">Sports Stats &amp; Betting Glossary</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        Plain-English definitions for the terms you&rsquo;ll see across
        MatchupLens — from win probability to point spreads.
      </p>

      <div className="panel" style={{ lineHeight: 1.8 }}>
        <dl style={{ margin: 0 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.term}
              style={{
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: i < TERMS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <dt style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {t.term}
              </dt>
              <dd style={{ margin: 0, color: "var(--text2)", fontSize: 14 }}>{t.def}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16, marginTop: 20 }}>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>
          Definitions are educational. Nothing here is betting advice. If you
          choose to wager, do so responsibly and only where legal. 21+. Gambling
          problem? Call 1-800-GAMBLER.{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>How our model works →</Link>
        </p>
      </div>
    </main>
  );
}
