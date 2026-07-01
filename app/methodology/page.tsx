import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Our Predictions Work — Methodology",
  description:
    "MatchupLens uses a transparent, data-driven model to estimate win probability for sports matchups. No black boxes. Here's exactly how it works.",
  alternates: { canonical: "https://matchuplens.com/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
        <h1 className="page-title">How Our Predictions Work</h1>
        <p className="page-sub" style={{ marginBottom: 32 }}>
          MatchupLens generates win probability estimates using a transparent,
          rules-based model. No black boxes — every factor is documented below.
        </p>

        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-title">What the model does</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>
            For each game, we produce a single number: the estimated probability
            that the home team wins. We use three inputs, applied in order of
            reliability:
          </p>
          <ol style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2, color: "var(--text2)" }}>
            <li>
              <strong>Market moneyline odds</strong> — when ESPN carries a
              consensus line, we convert it to implied probability and use that
              as the base.
            </li>
            <li>
              <strong>Season record differential</strong> — if no odds are
              available, we estimate win probability from the gap between each
              team&rsquo;s win percentage.
            </li>
            <li>
              <strong>Home-court/field advantage</strong> — when no market odds
              are available, we apply a fixed +5 percentage-point adjustment for
              the home side. This is not applied at neutral sites or for UFC
              bouts. (When market odds <em>are</em> available, home advantage is
              already priced into the line, so we don&rsquo;t add it again.)
            </li>
          </ol>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-title">Confidence levels</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>
            We display a confidence tier (High / Medium / Low) based on how far
            the favorite&rsquo;s win probability sits from a 50/50 coin flip
            (the &ldquo;edge&rdquo;). It reflects the model&rsquo;s certainty,
            not its accuracy:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2, color: "var(--text2)" }}>
            <li><strong>High</strong> — edge of 15 points or more (favorite ≥ 65% or ≤ 35%).</li>
            <li><strong>Medium</strong> — edge of 7 to 14 points.</li>
            <li><strong>Low</strong> — edge under 7 points (within ~7% of even).</li>
          </ul>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-title">Market agreement</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>
            When odds are available, we show whether our model pick agrees or
            disagrees with the betting market. &ldquo;Agrees with market&rdquo;
            means the model and the market favor the same side. &ldquo;Disagrees
            with market&rdquo; is displayed as a note — not as a betting signal.
          </p>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-title">What the model does NOT do</div>
          <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 2, color: "var(--text2)" }}>
            <li>It does not use machine learning or historical training data.</li>
            <li>It does not account for player-level injuries or line-up changes.</li>
            <li>It does not incorporate weather, referee tendencies, or travel fatigue.</li>
            <li>It does not predict margins, totals, or point spreads.</li>
          </ul>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-title">Data source</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>
            Team records, scores, and odds are sourced from ESPN&rsquo;s public
            scoreboard API. Pages refresh roughly every 5 minutes on the
            homepage and every 10 minutes on individual game pages. ESPN is not
            a sponsor or affiliate of MatchupLens.
          </p>
        </div>

        <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> MatchupLens predictions are for
            informational and entertainment purposes only. They are not betting
            advice and do not guarantee any outcome. Past model performance is
            not indicative of future results. If you choose to wager, please do
            so responsibly and within your means. Sports betting involves risk
            of financial loss.{" "}
            <Link href="/prediction-accuracy" style={{ color: "var(--blue)" }}>
              See how the model has performed
            </Link>{" "}
            ·{" "}
            <Link href="/legal/responsible-gambling" style={{ color: "var(--blue)" }}>
              Responsible gambling resources →
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
