import Link from "next/link";
import { getTodaysGames } from "@/lib/api";

export async function GamesRibbon() {
  const games = await getTodaysGames();
  return (
    <div className="ribbon">
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
              {g.status === "live" ? g.period : g.startTimeLocal}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
