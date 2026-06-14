import Link from "next/link";
import { getTodaysGames } from "@/lib/api";
import { LocalTime } from "./LocalTime";

export async function GamesRibbon() {
  const games = await getTodaysGames();
  const liveCount = games.filter((g) => g.status === "live").length;

  return (
    <div className="ribbon">
      <div className="ribbon-label">
        <span>Today&rsquo;s games ({games.length})</span>
        {liveCount > 0 && (
          <span className="ribbon-live">&nbsp;· {liveCount} LIVE</span>
        )}
      </div>
      <div className="ribbon-scroll">
        <div className="ribbon-inner">
          {games.map((g) => {
            const isLive = g.status === "live";
            const isFinal = g.status === "final";
            const hasScore = isLive || isFinal;
            const vs = g.sport === "ufc" || g.sport === "worldcup" ? "vs" : "@";
            return (
              <Link
                key={g.id}
                href={`/${g.sport}/${g.slug}`}
                className={`ribbon-card${isLive ? " live" : ""}`}
              >
                <div className="ribbon-league">
                  <span>{g.sport.toUpperCase()}</span>
                  {isLive && <span className="ribbon-live">● LIVE</span>}
                  {isFinal && <span style={{ color: "var(--text3)" }}>FINAL</span>}
                </div>
                <div className="ribbon-teams">
                  <div className="ribbon-row">
                    <span>{g.away.abbr}</span>
                    {hasScore && <span style={{ fontWeight: (isFinal && (g.awayScore ?? 0) > (g.homeScore ?? 0)) ? 800 : 600 }}>{g.awayScore}</span>}
                  </div>
                  <div className="ribbon-row">
                    <span><span style={{ color: "var(--text3)", fontSize: 10 }}>{vs} </span>{g.home.abbr}</span>
                    {hasScore && <span style={{ fontWeight: (isFinal && (g.homeScore ?? 0) > (g.awayScore ?? 0)) ? 800 : 600 }}>{g.homeScore}</span>}
                  </div>
                </div>
                <div className="ribbon-time">
                  {isLive
                    ? g.period
                    : isFinal
                      ? ""
                      : <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
