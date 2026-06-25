import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sports Betting Odds Explained: Moneylines, Spreads & Totals",
  description:
    "A beginner-friendly guide to reading sports betting odds: American moneylines, converting odds to implied probability, the vig, point spreads and covering, over/under totals, and pushes — with clear worked examples.",
  alternates: { canonical: "https://matchuplens.com/guides/sports-betting-odds-explained" },
};

export default function OddsExplainedPage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">Sports Betting Odds, Explained</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        Moneylines, spreads, totals, and the math that turns a price into a
        probability — in plain English, with examples.
      </p>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">The moneyline: who wins, straight up</div>
        <p style={{ color: "var(--text2)" }}>
          American odds use a baseline of $100. A <strong>negative</strong> number
          marks the favorite and shows how much you&rsquo;d risk to win $100: at
          −150, you stake $150 to win $100. A <strong>positive</strong> number
          marks the underdog and shows the profit on a $100 stake: at +130, a $100
          bet wins $130. The bigger the negative number, the heavier the favorite;
          the bigger the positive number, the longer the shot.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Turning odds into a probability</div>
        <p style={{ color: "var(--text2)" }}>
          Every price implies a win chance. The formulas:
        </p>
        <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 1.9 }}>
          <li><strong>Favorite (−):</strong> odds ÷ (odds + 100). So −150 → 150 ÷ 250 = <strong>60%</strong>.</li>
          <li><strong>Underdog (+):</strong> 100 ÷ (odds + 100). So +130 → 100 ÷ 230 ≈ <strong>43%</strong>.</li>
        </ul>
        <p style={{ color: "var(--text2)" }}>
          This &ldquo;implied probability&rdquo; is exactly what MatchupLens uses as
          the backbone of its win-probability estimate when a market line is
          available.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Why the two sides add up to more than 100%</div>
        <p style={{ color: "var(--text2)" }}>
          In the example above, 60% + 43% = 103%. That extra 3% is the{" "}
          <strong>vig</strong> (also called juice or the overround) — the
          sportsbook&rsquo;s built-in margin. To get a clean estimate, you
          &ldquo;de-vig&rdquo; by rescaling the two implied probabilities back to
          100%. It&rsquo;s why a fair model can land a few points off the raw
          number printed on the line.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Point spreads: winning by enough</div>
        <p style={{ color: "var(--text2)" }}>
          A spread handicaps the favorite to even out a lopsided matchup. If a team
          is −6.5, they must win by 7 or more to <strong>cover</strong>; their
          opponent at +6.5 covers by losing by 6 or fewer — or winning outright.
          The half-point (the &ldquo;hook&rdquo;) exists to prevent ties. A team can
          win the game and still fail to cover, which is why spread results and
          straight-up results often disagree.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Totals (over/under) and pushes</div>
        <p style={{ color: "var(--text2)" }}>
          The <strong>total</strong> is the projected combined score of both teams;
          you can wager whether the real total lands over or under it. When a whole
          number is involved and the result lands exactly on it — say a spread of −6
          and a 6-point win — the bet is a <strong>push</strong>, a tie against the
          line, and stakes are usually refunded.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">How MatchupLens uses the line</div>
        <p style={{ color: "var(--text2)" }}>
          We treat the market as the single strongest signal available. When a
          moneyline exists, we convert it to implied probability, remove the vig,
          and use that as our win-probability base; when it doesn&rsquo;t, we fall
          back to team records plus home advantage. We display the spread and total
          for context only. For the complete approach, see our{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>methodology</Link>{" "}
          and the{" "}
          <Link href="/glossary" style={{ color: "var(--blue)" }}>glossary</Link>.
        </p>
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16 }}>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>
          This guide is educational and is not betting advice. Odds and
          availability vary by sportsbook and by state. If you choose to wager, do
          so responsibly and only where legal. 21+. Gambling problem? Call
          1-800-GAMBLER.{" "}
          <Link href="/legal/responsible-gambling" style={{ color: "var(--blue)" }}>
            Responsible gambling resources →
          </Link>
        </p>
      </div>
    </main>
  );
}
