import Link from "next/link";
import { getTodaysGames } from "@/lib/api";
import { LocalTime } from "./LocalTime";

export async function GamesRibbon() {
  const games = await getTodaysGames();
  const liveCount = games.filter((g) => g.status === "live").length;

  return (
    <div className="ribbon">
      <details className="ribbon-details" open>
        <summary className="ribbon-summary">
          Today&rsquo;s games ({games.length})
          {liveCount > 0 && (
            <span className="ribbon-live">&nbsp;· {liveCount} LIVE</span>
          )}
        </summary>

        <div className="ribbon-grid">
          {games.map((g) => {
            const isLive = g.status === "live";
            const isFinal = g.status === "final";
            const hasScore = isLive || isFinal;
            const vs = g.sport === "ufc" || g.sport === "worldcup" ? "vs" : "@";

            return (
              <Link
                key={g.id}
                href={`/${g.sport}/${g.slug}`}
                className={`ribbon-card2${isLive ? " live" : ""}`}
              >
                {/* Status pill */}
                <div className="ribbon2-status">
                  {isLive ? (
                    <span className="ribbon-live">● {g.period ?? "LIVE"}</span>
                  ) : isFinal ? (
                    <span style={{ color: "var(--text3)" }}>FINAL</span>
                  ) : (
                    <span style={{ color: "var(--text3)" }}>
                      <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />
                    </span>
                  )}
                  <span className="ribbon2-league">{g.sport.toUpperCase()}</span>
                </div>

                {/* Away row */}
                <div className="ribbon2-row">
                  <span className="ribbon2-team">{g.away.abbr}</span>
                  {hasScore && (
                    <span
                      className="ribbon2-score"
                      style={
                        isFinal && (g.awayScore ?? 0) > (g.homeScore ?? 0)
                          ? { fontWeight: 800, color: "var(--text)" }
                          : undefined
                      }
                    >
                      {g.awayScore}
                    </span>
                  )}
                </div>

                {/* Home row */}
                <div className="ribbon2-row">
                  <span className="ribbon2-team">
                    <span style={{ color: "var(--text3)", fontSize: 10, marginRight: 2 }}>{vs}</span>
                    {g.home.abbr}
                  </span>
                  {hasScore && (
                    <span
                      className="ribbon2-score"
                      style={
                        isFinal && (g.homeScore ?? 0) > (g.awayScore ?? 0)
                          ? { fontWeight: 800, color: "var(--text)" }
                          : undefined
                      }
                    >
                      {g.homeScore}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </details>
    </div>
  );
}
