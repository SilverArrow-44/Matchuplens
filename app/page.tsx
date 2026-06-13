import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { GamesRibbon } from "@/components/GamesRibbon";
import { GameCard } from "@/components/GameCard";
import { TeamBadge } from "@/components/TeamBadge";
import { getFeaturedGame, getTodaysGames } from "@/lib/api";
import { AdSlot } from "@/components/AdSlot";

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
      <Topbar />
      <GamesRibbon />
      <main className="container" style={{ padding: "24px 16px" }}>
        <h1 className="page-title">Today&rsquo;s Games</h1>
        <p className="page-sub">
          Stats, head-to-head history, injuries, and a prediction for every
          matchup — {featured.dateLabel}.
        </p>

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
              {featured.startTimeLocal} · {featured.broadcast}
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
