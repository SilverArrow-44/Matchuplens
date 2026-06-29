import { ImageResponse } from "next/og";
import { getGameBySlug, isValidSport } from "@/lib/api";

export const runtime = "edge";
export const alt = "Matchup preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Cache the generated image so crawlers re-fetching it don't regenerate it
// every time (saves Fluid CPU / function execution).
export const revalidate = 86400;

interface Props {
  params: Promise<{ sport: string; slug: string }>;
}

export default async function Image({ params }: Props) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return new Response("Not found", { status: 404 });

  // OG image only needs the core matchup — skip the injury/H2H enrichment fetches.
  const game = await getGameBySlug(sport, slug, { enrich: false });
  if (!game) return new Response("Not found", { status: 404 });

  const favProb =
    game.winProbHome >= 50 ? game.winProbHome : 100 - game.winProbHome;
  const favTeam = game.winProbHome >= 50 ? game.home : game.away;
  const undTeam = game.winProbHome >= 50 ? game.away : game.home;

  const homeColor = game.home.color ?? "#3b82f6";
  const awayColor = game.away.color ?? "#8e8e9c";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d0d0d",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient background split by team colors */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${awayColor}22 0%, #0d0d0d 45%, #0d0d0d 55%, ${homeColor}22 100%)`,
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 48px 0",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: 1,
            }}
          >
            MATCHUPLENS.COM
          </span>
          <span
            style={{
              fontSize: 16,
              color: "#888",
              background: "#1a1a1a",
              padding: "6px 16px",
              borderRadius: 20,
            }}
          >
            {game.league} · {game.dateLabel}
          </span>
        </div>

        {/* Main matchup row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 0,
            padding: "0 48px",
            position: "relative",
          }}
        >
          {/* Away team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: 12,
            }}
          >
            {game.away.logo && (
               
              <img
                src={game.away.logo}
                width={120}
                height={120}
                alt={game.away.name}
                style={{ objectFit: "contain" }}
              />
            )}
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              {game.away.shortName}
            </span>
            <span style={{ fontSize: 18, color: "#888" }}>
              {game.away.record}
            </span>
          </div>

          {/* VS / score separator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              minWidth: 140,
            }}
          >
            {game.status === "final" ? (
              <>
                <span
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: -2,
                  }}
                >
                  {game.awayScore} – {game.homeScore}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#888",
                    letterSpacing: 2,
                  }}
                >
                  FINAL
                </span>
              </>
            ) : game.status === "live" ? (
              <>
                <span
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: -2,
                  }}
                >
                  {game.awayScore} – {game.homeScore}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#ef4444",
                    letterSpacing: 2,
                  }}
                >
                  ● {game.period ?? "LIVE"}
                </span>
              </>
            ) : (
              <>
                <span
                  style={{ fontSize: 40, fontWeight: 900, color: "#555" }}
                >
                  VS
                </span>
                <span style={{ fontSize: 16, color: "#888" }}>
                  {game.startTimeLocal}
                </span>
              </>
            )}
          </div>

          {/* Home team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              gap: 12,
            }}
          >
            {game.home.logo && (
               
              <img
                src={game.home.logo}
                width={120}
                height={120}
                alt={game.home.name}
                style={{ objectFit: "contain" }}
              />
            )}
            <span
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              {game.home.shortName}
            </span>
            <span style={{ fontSize: 18, color: "#888" }}>
              {game.home.record}
            </span>
          </div>
        </div>

        {/* Bottom prediction bar — only for upcoming/live games */}
        {game.status !== "final" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 48px 36px",
              gap: 12,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#1a1a1a",
                borderRadius: 12,
                padding: "12px 24px",
                border: "1px solid #2a2a2a",
              }}
            >
              <span style={{ fontSize: 16, color: "#888" }}>
                MatchupLens pick:
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#22c55e",
                }}
              >
                {favTeam.shortName} {favProb.toFixed(0)}%
              </span>
              <span style={{ fontSize: 14, color: "#555" }}>·</span>
              <span style={{ fontSize: 14, color: "#555" }}>
                {undTeam.shortName} {(100 - favProb).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
