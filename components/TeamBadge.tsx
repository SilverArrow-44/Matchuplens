import type { CSSProperties } from "react";
import Image from "next/image";
import type { Team } from "@/lib/types";

// Badge colors are derived from --team in globals.css with color-mix,
// so each theme can lighten/darken team colors for contrast.
export function TeamBadge({ team, size = 64 }: { team: Team; size?: number }) {
  return (
    <div
      className={size <= 40 ? "mini-badge" : "team-badge"}
      style={
        {
          "--team": team.color,
          width: size,
          height: size,
        } as CSSProperties
      }
    >
      {team.logo ? (
        <Image
          src={team.logo}
          alt={`${team.name} logo`}
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          style={{ objectFit: "contain" }}
        />
      ) : (
        team.abbr
      )}
    </div>
  );
}
