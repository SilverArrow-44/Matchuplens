import Link from "next/link";
import { getTodaysGames } from "@/lib/api";
import { LocalTime } from "./LocalTime";

export async function GamesRibbon() {
  const games = await getTodaysGames();
  const liveCount = games.filter((g) => g.status === "live").length;
  return (
    <div className="ribbon">
      {/* Mobile-only toggle — CSS-only via <details> */}
      <details className="ribbon-details" open>
        <summary className="ribbon-summary">
          Today&rsquo;s games ({games.length})
          {liveCount > 0 && (
            <span className="ribbon-live"> · {liveCount} LIVE</span>
          )}
        </summary>
      <div className="ribbon-inner">
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/${g.sport}/${g.slug}`}
            className={`ribbon-card${g.status === "live" ? " live" : ""}`}
          >
            <div className="ribbon-league">
              <span>{g.league}</span>
              {g.status === "live" && <span className="ribbon-live">● LIVE</span>}
            </div>
            <div className="ribbon-teams">
              <div className="ribbon-row">
                <span>{g.away.abbr}</span>
                <span>{g.status !== "scheduled" ? g.awayScore : ""}</span>
              </div>
              <div className="ribbon-row">
                <span>
                  {g.sport === "ufc" || g.sport === "worldcup" ? "vs" : "@"}{" "}
                  {g.home.abbr}
                </span>
                <span>{g.status !== "scheduled" ? g.homeScore : ""}</span>
              </div>
            </div>
            <div className="ribbon-time">
              {g.status === "live"
                ? g.period
                : <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />}
            </div>
          </Link>
        ))}
      </div>
      </details>
    </div>
  );
}
