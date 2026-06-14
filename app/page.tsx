import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { TeamBadge } from "@/components/TeamBadge";
import { getFeaturedGame, getTodaysGames } from "@/lib/api";
import { AdSlot } from "@/components/AdSlot";
import { LocalTime } from "@/components/LocalTime";

// Refresh live scores/odds every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [featured, games] = await Promise.all([
    getFeaturedGame(),
    getTodaysGames(),
  ]);
  const rest = games.filter((g) => g.id !== featured.id);

  return (
    <>
      <main className="container" style={{ padding: "24px 16px" }}>

        {/* Brand hero */}
        <div className="brand-hero">
          <h1 className="brand-tagline">Know your edge before tip&#8209;off.</h1>
          <p className="brand-sub">
            Win probability, team stats, H2H history, and injury reports for
            every game — updated live.
          </p>
          <div className="brand-chips">
            <span className="brand-chip">📊 Team stats</span>
            <span className="brand-chip">🔮 Win probability</span>
            <span className="brand-chip">⚔️ Head-to-head</span>
            <span className="brand-chip">🏥 Injuries</span>
            <span className="brand-chip">🔴 Live scores</span>
          </div>
        </div>

        <div className="section-h">
          Featured matchup · {featured.dateLabel}
        </div>

        {/* Featured game */}
        <Link
          href={`/${featured.sport}/${featured.slug}`}
          className="game-card"
          style={{ borderColor: "var(--border2)", padding: 24 }}
        >
          <div className="game-card-top">
            <span style={{ color: "var(--blue)" }}>
              ★ Featured · {featured.contextLabel}
            </span>
            <span>
              <LocalTime utc={featured.startTimeUTC} fallback={featured.startTimeLocal} /> · {featured.broadcast}
            </span>
          </div>
          <div className="hero-matchup">
            <div className="hero-team">
              <TeamBadge team={featured.away} />
              <div className="hero-team-name">{featured.away.name}</div>
              <div className="hero-team-record">{featured.away.record}</div>
            </div>
            <div className="hero-vs">VS</div>
            <div className="hero-team">
              <TeamBadge team={featured.home} />
              <div className="hero-team-name">{featured.home.name}</div>
              <div className="hero-team-record">{featured.home.record}</div>
            </div>
          </div>
          <div
            className="game-card-meta"
            style={{ justifyContent: "center", marginTop: 16 }}
          >
            <span>{featured.venue}</span>
            <span className="prob-pill">
              Win probability: {featured.home.abbr}{" "}
              {featured.winProbHome.toFixed(1)}%
            </span>
          </div>
        </Link>

        <AdSlot id="home-top" />

        <div className="section-h" style={{ marginTop: 24 }}>
          All games today
        </div>
        {rest.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </main>
    </>
  );
}
