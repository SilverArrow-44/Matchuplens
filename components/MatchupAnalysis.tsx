import type { GameDetail } from "@/lib/types";
import { buildMatchupAnalysis } from "@/lib/analysis";

/**
 * Server component — renders ~400-600 words of data-driven analysis
 * generated from real game stats. Helps SEO by giving each page unique,
 * readable content beyond tables and widgets.
 */
export function MatchupAnalysis({ game }: { game: GameDetail }) {
  // Don't render for completed games — they get a different recap layout
  if (game.status === "final") return null;

  const { overview, whyHome, whyAway, bettingContext, predictionSummary } =
    buildMatchupAnalysis(game);

  return (
    <section style={{ marginTop: 32 }}>
      <div className="section-h">Matchup analysis</div>
      <div className="panel" style={{ lineHeight: 1.8, fontSize: 14 }}>
        {/* Overview */}
        <p style={{ marginBottom: 16 }}>{overview}</p>

        {/* Why each team can win */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
          className="analysis-grid"
        >
          <div
            className="storyline"
            style={{ borderLeftColor: game.home.color, margin: 0 }}
          >
            <p>{whyHome}</p>
          </div>
          <div
            className="storyline"
            style={{ borderLeftColor: "var(--red)", margin: 0 }}
          >
            <p>{whyAway}</p>
          </div>
        </div>

        {/* Betting market context */}
        {bettingContext && (
          <p style={{ marginBottom: 16, color: "var(--text2)" }}>
            <strong>Betting context:</strong> {bettingContext}
          </p>
        )}

        {/* Prediction summary */}
        <p style={{ color: "var(--text2)" }}>
          <strong>Prediction summary:</strong> {predictionSummary}
        </p>
      </div>
    </section>
  );
}
