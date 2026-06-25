import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides — Predictions, Odds & Tournaments Explained",
  description:
    "MatchupLens guides: learn how to read a win probability, how sports betting odds work, and everything about the 2026 FIFA World Cup format and schedule.",
  alternates: { canonical: "https://matchuplens.com/guides" },
};

const GUIDES: { href: string; title: string; blurb: string }[] = [
  {
    href: "/guides/how-to-read-win-probability",
    title: "How to Read a Win Probability",
    blurb:
      "What a 65% win chance actually means, how confidence levels work, and why favorites lose all the time.",
  },
  {
    href: "/guides/sports-betting-odds-explained",
    title: "Sports Betting Odds, Explained",
    blurb:
      "Moneylines, spreads, totals, and how to turn a price into an implied probability — with worked examples.",
  },
  {
    href: "/guides/world-cup-2026",
    title: "The 2026 FIFA World Cup: A Complete Guide",
    blurb:
      "The new 48-team format, the 12 groups, the full schedule, all 16 host cities, and how the knockouts work.",
  },
];

export default function GuidesIndexPage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">Guides</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        Plain-English explainers on predictions, betting odds, and the
        tournaments we cover.
      </p>

      {GUIDES.map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className="game-card"
          style={{ display: "block", marginBottom: 14 }}
        >
          <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 6 }}>
            {g.title}
          </div>
          <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>
            {g.blurb}
          </div>
          <div style={{ color: "var(--blue)", fontWeight: 600, fontSize: 13, marginTop: 10 }}>
            Read guide →
          </div>
        </Link>
      ))}
    </main>
  );
}
