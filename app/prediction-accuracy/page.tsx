import type { Metadata } from "next";
import Link from "next/link";
import { getAccuracyStats } from "@/lib/api";
import { getLoggedStats } from "@/lib/predictionLog";

export const metadata: Metadata = {
  title: "Prediction Accuracy Tracker — How Our Model Performs",
  description:
    "How MatchupLens's model picks compare to actual results for recently completed games — overall hit rate, accuracy by league, and accuracy by confidence level. Transparent, with honest caveats.",
  alternates: { canonical: "https://matchuplens.com/prediction-accuracy" },
};

function pct(correct: number, total: number): string {
  return total > 0 ? `${((correct / total) * 100).toFixed(1)}%` : "—";
}

export default async function PredictionAccuracyPage() {
  // Prefer the verified pre-game log once it has reconciled entries; otherwise
  // fall back to reconstructing from recent finals.
  const logged = await getLoggedStats();
  const useLogged = logged.overall.total > 0;
  const stats = useLogged ? logged : await getAccuracyStats(7);
  const hasData = stats.overall.total > 0;

  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 820 }}>
      <h1 className="page-title">Prediction Accuracy Tracker</h1>
      <p className="page-sub" style={{ marginBottom: 24 }}>
        {useLogged
          ? "How our model's pick has compared to the final result, logged before each game and reconciled after."
          : `How our model's pick compared to the final result for completed games in the last ${stats.windowDays} days.`}
      </p>

      {/* Honest caveat up top — trust depends on not overstating this. */}
      <div className="panel" style={{ borderLeft: "3px solid var(--amber, #f59e0b)", marginBottom: 24, lineHeight: 1.7 }}>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>
          {useLogged ? (
            <>
              <strong>How to read this:</strong> each pick is captured{" "}
              <em>before</em> kickoff and reconciled against the final result, so
              this is a verified record that grows over time. Soccer draws are
              excluded (the model estimates a two-outcome win probability). Past
              performance does not indicate future results.
            </>
          ) : (
            <>
              <strong>How to read this:</strong> pre-game logging has just begun,
              so until it accumulates results these picks are reconstructed from
              currently-available data and may differ slightly from the live
              pre-game lean. Sample sizes are small and will grow. Soccer draws
              are excluded. Treat this as an evolving, good-faith scorecard.
            </>
          )}
        </p>
      </div>

      {!hasData ? (
        <div className="panel" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
          No decisively-completed games in the last {stats.windowDays} days yet.
          Accuracy fills in here automatically as games finish — check back after
          the next slate concludes.
        </div>
      ) : (
        <>
          {/* Overall */}
          <div className="info-strip" style={{ marginTop: 0, marginBottom: 24 }}>
            <div className="info-box">
              <div className="info-label">Overall</div>
              <div className="info-value" style={{ fontSize: 22, color: "var(--green)" }}>
                {pct(stats.overall.correct, stats.overall.total)}
              </div>
              <div className="info-sub">
                {stats.overall.correct} of {stats.overall.total} correct
              </div>
            </div>
            {stats.byConfidence.map((b) => (
              <div className="info-box" key={b.key}>
                <div className="info-label">{b.key} confidence</div>
                <div className="info-value" style={{ fontSize: 22 }}>
                  {pct(b.correct, b.total)}
                </div>
                <div className="info-sub">
                  {b.correct} of {b.total}
                </div>
              </div>
            ))}
          </div>

          {/* By league */}
          <div className="section-h" style={{ marginBottom: 12 }}>Accuracy by league</div>
          <div className="panel" style={{ padding: "4px 8px", marginBottom: 28 }}>
            {stats.byLeague.map((b) => (
              <div className="side-row" key={b.key}>
                <span className="side-label">{b.key}</span>
                <span className="side-value">
                  {pct(b.correct, b.total)}{" "}
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>
                    ({b.correct}/{b.total})
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Per-game log */}
          <div className="section-h" style={{ marginBottom: 12 }}>Completed games</div>
          <div style={{ overflowX: "auto" }}>
            <table className="injury-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Matchup</th>
                  <th>Model pick</th>
                  <th>Prob</th>
                  <th>Conf.</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {stats.rows.map((r) => (
                  <tr key={`${r.sport}-${r.slug}`}>
                    <td style={{ whiteSpace: "nowrap" }}>{r.date}</td>
                    <td>
                      <Link href={`/${r.sport}/${r.slug}`} style={{ color: "var(--blue)" }}>
                        {r.matchup}
                      </Link>
                    </td>
                    <td>{r.pick}</td>
                    <td>{r.pickPct.toFixed(0)}%</td>
                    <td>{r.confidence}</td>
                    <td>
                      <span className={`badge ${r.correct ? "badge-green" : "badge-red"}`}>
                        {r.correct ? "✓ Correct" : "✗ Miss"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Internal links */}
      <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 28, lineHeight: 1.8 }}>
        See{" "}
        <Link href="/methodology" style={{ color: "var(--blue)" }}>how the model works</Link>,
        browse{" "}
        <Link href="/" style={{ color: "var(--blue)" }}>today&rsquo;s matchups</Link>, or
        read our{" "}
        <Link href="/guides/how-to-read-win-probability" style={{ color: "var(--blue)" }}>
          guide to reading a win probability
        </Link>
        .
      </p>

      <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 16, lineHeight: 1.6 }}>
        Predictions are informational and for entertainment only — not betting
        advice, and past performance does not indicate future results. Data may
        be delayed or estimated. 21+.
      </p>
    </main>
  );
}
