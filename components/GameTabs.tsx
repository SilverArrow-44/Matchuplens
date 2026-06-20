"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { GameDetail, StatComparison } from "@/lib/types";
import { AffiliateCTA } from "./AffiliateCTA";

const NEUTRAL_TEAM = "#8e8e9c";

function tabsFor(isFight: boolean) {
  return [
    "Overview",
    isFight ? "Fighter Stats" : "Team Stats",
    isFight ? "Fight History" : "H2H History",
    isFight ? "Fighters" : "Players",
    isFight ? "Camp Report" : "Injuries",
    "🔮 Prediction",
  ];
}

function StatRows({ stats, game }: { stats: StatComparison[]; game: GameDetail }) {
  if (!stats.length) return null;
  return (
    <div className="stat-grid">
      <div className="stat-row" style={{ background: "transparent", border: "none", padding: "0 14px" }}>
        <span className="stat-val left" style={{ color: game.home.color, fontSize: 12 }}>
          {game.home.abbr}
        </span>
        <span />
        <span className="stat-val right" style={{ color: "var(--text2)", fontSize: 12 }}>
          {game.away.abbr}
        </span>
      </div>
      {stats.map((s) => (
        <div className="stat-row" key={s.name}>
          <span className={`stat-val left${s.better === "home" ? " win" : ""}`}>
            {s.homeValue}
          </span>
          <span className="stat-name">{s.name}</span>
          <span className={`stat-val right${s.better === "away" ? " win" : ""}`}>
            {s.awayValue}
          </span>
        </div>
      ))}
    </div>
  );
}

function statusBadge(status: string) {
  const cls =
    status === "Out"
      ? "badge badge-red"
      : status === "Questionable"
        ? "badge badge-amber"
        : "badge badge-green";
  return <span className={cls}>{status}</span>;
}

export function GameTabs({ game }: { game: GameDetail }) {
  const [tab, setTab] = useState(0);
  const isFight = game.sport === "ufc";
  const TABS = tabsFor(isFight);
  const probHome = game.prediction.winProbHome;
  const probAway = 100 - probHome;

  // Confidence color
  const confidenceColor =
    game.prediction.confidence === "High"
      ? "var(--green)"
      : game.prediction.confidence === "Medium"
        ? "var(--amber)"
        : "var(--red)";

  // Market agreement: compare betting market factor direction to model pick
  const marketFactor = game.prediction.factors.find(
    (f) => f.name === "Betting market"
  );
  const marketAgreement = marketFactor
    ? (marketFactor.impact >= 0 && probHome >= 50) ||
      (marketFactor.impact < 0 && probHome < 50)
      ? "✓ Model agrees with market"
      : "⚠ Model differs from market"
    : null;

  return (
    <div>
      <div className="tabs" role="tablist">
        {TABS.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === i}
            className={`tab-btn${tab === i ? " active" : ""}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* ---------------- Overview ---------------- */}
        {tab === 0 && (
          <div>
            <div className="section-h">{game.overview.recapTitle}</div>
            <StatRows stats={game.overview.recapStats} game={game} />
            <div className="section-h">Key storylines</div>
            {game.overview.storylines.map((s, i) => (
              <div
                className="storyline"
                key={i}
                style={{
                  borderLeftColor:
                    s.team === "home"
                      ? game.home.color
                      : s.team === "away"
                        ? "var(--red)"
                        : "var(--border2)",
                }}
                dangerouslySetInnerHTML={{ __html: s.text }}
              />
            ))}
          </div>
        )}

        {/* ---------------- Team Stats ---------------- */}
        {tab === 1 &&
          game.teamStats.playoff.length === 0 &&
          game.teamStats.season.length === 0 && (
            <div className="storyline">
              Team stat comparisons land here once both sides have data —
              check back closer to game time.
            </div>
          )}
        {tab === 1 && (
          <div>
            {game.teamStats.playoff.length > 0 && (
              <>
                <div className="section-h">Playoffs</div>
                <StatRows stats={game.teamStats.playoff} game={game} />
              </>
            )}
            {game.teamStats.season.length > 0 && (
              <>
                <div className="section-h">
                  {isFight
                    ? "Career stats"
                    : game.sport === "worldcup"
                      ? "Recent form"
                      : game.sport === "soccer" || game.sport === "mlb"
                        ? "Season"
                        : "Regular season"}
                </div>
                <StatRows stats={game.teamStats.season} game={game} />
              </>
            )}
          </div>
        )}

        {/* ---------------- H2H ---------------- */}
        {tab === 2 && game.h2h.games.length === 0 && (
          <div className="storyline">
            Head-to-head history for this matchup is coming soon — we&rsquo;re
            wiring up the historical results feed.
          </div>
        )}
        {tab === 2 && game.h2h.games.length > 0 && (
          <div>
            <div className="h2h-summary">
              <div style={{ textAlign: "center" }}>
                <div className="h2h-wins" style={{ color: game.home.color }}>
                  {game.h2h.homeWins}
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {game.home.abbr}
                </div>
              </div>
              <div className="h2h-dash">—</div>
              <div style={{ textAlign: "center" }}>
                <div className="h2h-wins">{game.h2h.awayWins}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {game.away.abbr}
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--text3)",
                marginBottom: 12,
              }}
            >
              {game.h2h.windowLabel}
            </div>
            <div className="panel" style={{ padding: "4px 8px" }}>
              {game.h2h.games.map((g, i) => (
                <div className="h2h-game" key={i}>
                  <span className="h2h-date">{g.date}</span>
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>
                    {g.location}
                  </span>
                  <span className="h2h-score">{g.score}</span>
                  <span
                    className="win-tag"
                    style={
                      {
                        "--team":
                          g.winnerAbbr === game.home.abbr
                            ? game.home.color
                            : g.winnerAbbr === game.away.abbr
                              ? game.away.color
                              : NEUTRAL_TEAM,
                      } as CSSProperties
                    }
                  >
                    {g.winnerAbbr}
                  </span>
                </div>
              ))}
            </div>
            <div className="storyline" style={{ marginTop: 12 }}>
              <strong>Trend:</strong> {game.h2h.trend}
            </div>
          </div>
        )}

        {/* ---------------- Players ---------------- */}
        {tab === 3 && game.players.length === 0 && (
          <div className="storyline">
            Player spotlights appear here once lineups and leaders are
            available — usually closer to game time.
          </div>
        )}
        {tab === 3 && (
          <div className="player-grid">
            {game.players.map((p, i) => {
              const isHome = p.teamAbbr === game.home.abbr;
              return (
                <div className="player-card" key={`${p.name}-${i}`}>
                  <div className="player-head">
                    <div
                      className="player-avatar"
                      style={
                        {
                          "--team": isHome
                            ? game.home.color
                            : game.away.color,
                        } as CSSProperties
                      }
                    >
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          width={42}
                          height={42}
                          style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        p.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                      )}
                    </div>
                    <div>
                      <div className="player-name">{p.name}</div>
                      <div className="player-pos">
                        {p.teamAbbr} · {p.position}
                      </div>
                    </div>
                  </div>
                  <div className="player-stats">
                    {p.stats.map((s) => (
                      <div className="pstat" key={s.label}>
                        <div className="pstat-val">{s.value}</div>
                        <div className="pstat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="player-note">{p.note}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- Injuries ---------------- */}
        {tab === 4 && game.injuries.rows.length === 0 && (
          <div className="storyline">
            No injury report available yet for this game. Reports typically
            land within 24 hours of start time.
          </div>
        )}
        {tab === 4 && game.injuries.rows.length > 0 && (
          <div>
            <div style={{ overflowX: "auto" }}>
            <table className="injury-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Team</th>
                  <th>Injury</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {game.injuries.rows.map((r, i) => (
                  <tr key={`${r.player}-${r.teamAbbr}-${i}`}>
                    <td>{r.player}</td>
                    <td>{r.teamAbbr}</td>
                    <td>{r.injury}</td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 10 }}>
              Source: {game.injuries.source} · Updated {game.injuries.updated}
            </div>
          </div>
        )}

        {/* ---------------- Prediction ---------------- */}
        {tab === 5 && (
          <div>
            {/* Final game: show whether model was right */}
            {game.status === "final" && (() => {
              const homeWon = (game.homeScore ?? 0) > (game.awayScore ?? 0);
              const correct =
                (homeWon && game.prediction.pickAbbr === game.home.abbr) ||
                (!homeWon && game.prediction.pickAbbr === game.away.abbr);
              return (
                <div
                  className="storyline"
                  style={{
                    borderLeftColor: correct ? "var(--green)" : "var(--red)",
                    marginBottom: 16,
                  }}
                >
                  <strong>Final: {game.away.abbr} {game.awayScore} – {game.home.abbr} {game.homeScore}</strong>
                  <br />
                  Model picked <strong>{game.prediction.pickTeamName}</strong> —{" "}
                  {correct
                    ? "✅ Correct. The model called this one."
                    : "❌ Incorrect. The model missed this one."}
                </div>
              );
            })()}

            <div className="prob-bar-wrap">
              <div className="prob-bar">
                <div
                  className="prob-side"
                  style={{
                    width: `${probHome}%`,
                    background: game.home.color,
                  }}
                >
                  {game.home.abbr} {probHome.toFixed(1)}%
                </div>
                <div
                  className="prob-side away"
                  style={{ width: `${probAway}%`, background: "var(--bg4)" }}
                >
                  {game.away.abbr} {probAway.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="section-h">Factors</div>
            {game.prediction.factors.map((f) => (
              <div
                className={`factor ${
                  f.impact > 0 ? "pos" : f.impact < 0 ? "neg" : "neutral"
                }`}
                key={f.name}
              >
                <span className="factor-icon">{f.icon}</span>
                <span>
                  <span className="factor-name">{f.name}</span>
                  <br />
                  <span className="factor-desc">{f.description}</span>
                </span>
                <span
                  className={`factor-impact ${f.impact > 0 ? "pos" : f.impact < 0 ? "neg" : ""}`}
                >
                  {f.impact > 0 ? "+" : ""}
                  {f.impact}% {game.home.abbr}
                </span>
              </div>
            ))}

            <div className="pick-box">
              <div className="pick-label">MatchupLens Pick</div>
              <div className="pick-team">{game.prediction.pickTeamName}</div>
              <div className="pick-reason">{game.prediction.reasoning}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, alignItems: "center" }}>
                <span
                  className="confidence"
                  style={{ background: `color-mix(in srgb, ${confidenceColor} 15%, transparent)`, color: confidenceColor, borderColor: `color-mix(in srgb, ${confidenceColor} 40%, transparent)` }}
                >
                  {game.prediction.confidence} confidence
                </span>
                {marketAgreement && (
                  <span
                    className="confidence"
                    style={{
                      color: marketAgreement.startsWith("✓") ? "var(--green)" : "var(--amber)",
                      background: marketAgreement.startsWith("✓")
                        ? "color-mix(in srgb, var(--green) 15%, transparent)"
                        : "color-mix(in srgb, var(--amber) 15%, transparent)",
                      borderColor: marketAgreement.startsWith("✓")
                        ? "color-mix(in srgb, var(--green) 40%, transparent)"
                        : "color-mix(in srgb, var(--amber) 40%, transparent)",
                    }}
                  >
                    {marketAgreement}
                  </span>
                )}
              </div>
            </div>

            {/* Prediction disclaimer */}
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, lineHeight: 1.5 }}>
              For entertainment only. Not betting advice. You are solely responsible
              for your wagering decisions.{" "}
              <Link href="/legal/disclaimer" style={{ color: "var(--blue)" }}>Full disclaimer →</Link>
            </p>

            {/* How the model works */}
            <details style={{ marginTop: 16 }}>
              <summary
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "8px 0",
                }}
              >
                ℹ️ How this model works
              </summary>
              <div
                className="storyline"
                style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7 }}
              >
                <strong>Methodology:</strong> {game.prediction.methodology}
                <br /><br />
                <strong>Signal priority:</strong> Sportsbook moneylines (when available) →
                season record differential → home-court/field advantage (+5%).
                Win probability is clamped to 8–92% — extreme certainty is not
                meaningful for sports outcomes. Confidence tiers: High ≥15pp edge,
                Medium ≥7pp, Low &lt;7pp.
                <br /><br />
                <strong>Limitations:</strong> This model does not yet factor in recent
                form streaks, injuries, rest days, or weather. These are planned
                improvements as the data layer matures.
              </div>
            </details>

            {/* AFFILIATE PLACEMENT #2 — right after the pick, peak intent */}
            <AffiliateCTA style={{ marginTop: 16 }} />

            <div className="disclaimer">
              Predictions are editorial analysis for entertainment purposes
              only and are not guarantees of outcomes. Sports betting available
              in select states only. If you choose to bet, wager responsibly.
              21+. Gambling problem? Call 1-800-GAMBLER.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
