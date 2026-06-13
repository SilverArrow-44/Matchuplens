import Link from "next/link";
import type { GameSummary } from "@/lib/types";
import { TeamBadge } from "./TeamBadge";
import { LocalTime } from "./LocalTime";

export function GameCard({ game }: { game: GameSummary }) {
  return (
    <Link href={`/${game.sport}/${game.slug}`} className="game-card">
      <div className="game-card-top">
        <span>
          <span className={`league-chip chip-${game.sport}`}>
            {game.sport === "soccer"
              ? game.league
              : game.sport === "worldcup"
                ? "FIFA WORLD CUP 2026"
                : game.sport.toUpperCase()}
          </span>
          {game.contextLabel ?? game.league}
        </span>
        <LocalTime utc={game.startTimeUTC} fallback={game.startTimeLocal} />
      </div>
      <div className="game-card-teams">
        <div className="game-card-team">
          <TeamBadge team={game.away} size={32} />
          {game.away.shortName}
        </div>
        <span style={{ color: "var(--text3)", fontWeight: 800 }}>
          {game.sport === "ufc" || game.sport === "worldcup" ? "vs" : "@"}
        </span>
        <div className="game-card-team">
          {game.home.shortName}
          <TeamBadge team={game.home} size={32} />
        </div>
      </div>
      <div className="game-card-meta">
        <span>{game.venue}</span>
        <span>{game.broadcast}</span>
        <span className="prob-pill">
          {game.winProbHome >= 50
            ? `${game.home.abbr} ${game.winProbHome.toFixed(0)}%`
            : `${game.away.abbr} ${(100 - game.winProbHome).toFixed(0)}%`}
        </span>
      </div>
    </Link>
  );
}
