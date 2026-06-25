import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Read a Win Probability (and a Confidence Level)",
  description:
    "A win probability is a long-run frequency, not a guarantee. Learn what a 65% win chance actually means, how to read confidence levels, why underdogs win all the time, and how to use win-probability estimates sensibly.",
  alternates: { canonical: "https://matchuplens.com/guides/how-to-read-win-probability" },
};

export default function HowToReadWinProbabilityPage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">How to Read a Win Probability</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        A number like &ldquo;65%&rdquo; looks precise, but it&rsquo;s easy to
        misread. Here&rsquo;s what a win probability actually tells you — and what
        it doesn&rsquo;t.
      </p>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">It&rsquo;s a frequency, not a promise</div>
        <p style={{ color: "var(--text2)" }}>
          A win probability is an estimate of how often a result would happen if
          the same matchup were played many times. If we list a team at 65%, the
          honest reading is: &ldquo;in a long run of games like this one, we&rsquo;d
          expect this side to win about 65 out of 100.&rdquo; That also means the
          other team wins about 35 out of 100 — which is a lot. A 65% favorite
          losing isn&rsquo;t the model being &ldquo;wrong&rdquo;; it&rsquo;s the 35%
          showing up, exactly as expected.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Favorites lose constantly — and that&rsquo;s normal</div>
        <p style={{ color: "var(--text2)" }}>
          Upsets aren&rsquo;t flukes; they&rsquo;re built into the percentages. A
          team favored at 70% will still lose roughly three times out of ten. Over
          a full season of slates, you should expect a steady stream of
          &ldquo;wrong&rdquo; favorites — if every favorite won, the probabilities
          would be broken, not accurate. The right way to judge any probability
          source is over a large sample, not on a single game.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">What the confidence level means</div>
        <p style={{ color: "var(--text2)" }}>
          On MatchupLens, each pick carries a <strong>High / Medium / Low</strong>{" "}
          confidence tag based on how far the favorite sits from a coin flip:
        </p>
        <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 1.9 }}>
          <li><strong>High</strong> — an edge of 15 points or more (favorite ≥ 65%).</li>
          <li><strong>Medium</strong> — an edge of 7 to 14 points.</li>
          <li><strong>Low</strong> — under 7 points; essentially a toss-up.</li>
        </ul>
        <p style={{ color: "var(--text2)" }}>
          Confidence describes how lopsided the inputs are — <em>not</em> how
          accurate the call will turn out to be. A &ldquo;High&rdquo; game can
          still go the other way.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Why we show &ldquo;market agreement&rdquo;</div>
        <p style={{ color: "var(--text2)" }}>
          When a betting line is available, we note whether our pick agrees with
          the market. Agreement is a sanity check — two independent reads landing
          on the same side. A disagreement isn&rsquo;t a signal to bet against the
          market; it usually just means the inputs are close, and it&rsquo;s a cue
          to dig into the matchup yourself.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Three common mistakes</div>
        <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 1.9 }}>
          <li><strong>Treating 65% as 100%.</strong> A favorite is more likely to win, not certain to.</li>
          <li><strong>Judging a model on one game.</strong> Probabilities only reveal themselves over many results.</li>
          <li><strong>Ignoring what&rsquo;s missing.</strong> Our model doesn&rsquo;t yet weigh rest, travel, weather, or late lineup news — context still matters.</li>
        </ul>
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16 }}>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>
          Win probabilities on MatchupLens are editorial analysis for
          informational and entertainment purposes only — not betting advice, and
          not a guarantee of any outcome. If you choose to wager, do so responsibly
          and only where legal. 21+. Gambling problem? Call 1-800-GAMBLER.{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>
            See the full methodology →
          </Link>
        </p>
      </div>
    </main>
  );
}
