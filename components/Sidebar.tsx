import type { GameDetail } from "@/lib/types";
import { AffiliateCTA } from "./AffiliateCTA";
import { Newsletter } from "./Newsletter";
import { AdSlot } from "./AdSlot";

export function Sidebar({ game }: { game: GameDetail }) {
  return (
    <aside className="sidebar">
      <div className="panel">
        <div className="panel-title">Matchup</div>
        <div className="side-row">
          <span className="side-label">{game.home.shortName}</span>
          <span className="side-value">{game.home.record}</span>
        </div>
        <div className="side-row">
          <span className="side-label">{game.away.shortName}</span>
          <span className="side-value">{game.away.record}</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Betting trends</div>
        <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
          For informational context only — not betting advice.
        </p>
        {game.ats.map((row) => (
          <div className="side-row" key={row.label}>
            <span className="side-label">{row.label}</span>
            <span className="side-value">{row.value}</span>
          </div>
        ))}
        {/* AFFILIATE PLACEMENT #1 — geo-gated: sportsbook hidden in restricted states */}
        <AffiliateCTA />
      </div>

      <div className="panel">
        <div className="panel-title">
          {game.sport === "ufc" ? "The fighters" : "Players to watch"}
        </div>
        {game.players.slice(0, 4).map((p) => (
          <div className="side-row" key={p.name}>
            <span className="side-label">
              {p.name}
              <span style={{ color: "var(--text3)", fontSize: 12 }}>
                {" "}
                · {p.teamAbbr}
              </span>
            </span>
            <span className="side-value">
              {p.stats[0].value}{" "}
              <span style={{ color: "var(--text3)", fontSize: 11 }}>
                {p.stats[0].label}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">Win probability</div>
        <div className="side-row">
          <span className="side-label">{game.home.abbr}</span>
          <span
            className="side-value"
            style={game.winProbHome >= 50 ? { color: "var(--green)" } : undefined}
          >
            {game.winProbHome.toFixed(1)}%
          </span>
        </div>
        <div className="side-row">
          <span className="side-label">{game.away.abbr}</span>
          <span
            className="side-value"
            style={game.winProbHome < 50 ? { color: "var(--green)" } : undefined}
          >
            {(100 - game.winProbHome).toFixed(1)}%
          </span>
        </div>
      </div>

      <Newsletter />
      <AdSlot id="sidebar" />
    </aside>
  );
}
