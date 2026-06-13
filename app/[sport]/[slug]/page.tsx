import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { GamesRibbon } from "@/components/GamesRibbon";
import { Sidebar } from "@/components/Sidebar";
import { GameTabs } from "@/components/GameTabs";
import { TeamBadge } from "@/components/TeamBadge";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { AdSlot } from "@/components/AdSlot";
import { LocalTime } from "@/components/LocalTime";
import {
  getAllGameParams,
  getGameBySlug,
  getTodaysGames,
  isValidSport,
} from "@/lib/api";

// Refresh live scores/odds every 60 seconds; unknown slugs render on demand
export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ sport: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllGameParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const game = await getGameBySlug(sport, slug);
  if (!game) return {};
  const title = `${game.away.shortName} vs ${game.home.shortName} Prediction, Stats & H2H — ${game.dateLabel}`;
  const description = `${game.away.name} vs ${game.home.name} (${game.contextLabel ?? game.league}): win probability ${game.winProbHome.toFixed(1)}% ${game.home.abbr}, team stats, last 10 head-to-head, injury report, and our pick.`;
  return { title, description };
}

export default async function GamePage({ params }: Props) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();
  const game = await getGameBySlug(sport, slug);
  if (!game) notFound();

  const otherGames = (await getTodaysGames()).filter((g) => g.id !== game.id);
  const favorite = game.winProbHome >= 50 ? game.home : game.away;
  const favProb =
    game.winProbHome >= 50 ? game.winProbHome : 100 - game.winProbHome;

  // SportsEvent structured data — helps Google show rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${game.away.name} vs ${game.home.name}`,
    description: game.contextLabel ?? game.league,
    startDate: game.dateLabel,
    location: {
      "@type": "Place",
      name: game.venue,
      address: game.city,
    },
    competitor: [
      { "@type": "SportsTeam", name: game.away.name },
      { "@type": "SportsTeam", name: game.home.name },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Topbar activeSport={sport} />
      <GamesRibbon />
      <main className="container">
        <div className="page-grid">
          <Sidebar game={game} />
          <div>
            {/* Hero */}
            <section className="hero">
              <div className="hero-context">{game.contextLabel}</div>
              <div className="hero-matchup">
                <div className="hero-team">
                  <TeamBadge team={game.away} />
                  <div className="hero-team-name">{game.away.name}</div>
                  <div className="hero-team-record">{game.away.record}</div>
                </div>
                <div className="hero-vs">
                  {game.status === "scheduled" ? (
                    "VS"
                  ) : (
                    <span className="hero-score">
                      {game.awayScore} – {game.homeScore}
                    </span>
                  )}
                </div>
                <div className="hero-team">
                  <TeamBadge team={game.home} />
                  <div className="hero-team-name">{game.home.name}</div>
                  <div className="hero-team-record">{game.home.record}</div>
                </div>
              </div>

              {/* Info strip */}
              <div className="info-strip">
                <div className="info-box">
                  <div className="info-label">Start</div>
                  <div className="info-value"><LocalTime utc={game.startTimeUTC} fallback={game.startTimeLocal} /></div>
                  <div className="info-sub">{game.dateLabel}</div>
                </div>
                <div className="info-box">
                  <div className="info-label">Venue</div>
                  <div className="info-value">{game.venue}</div>
                  <div className="info-sub">{game.city}</div>
                </div>
                <div className="info-box">
                  <div className="info-label">Broadcast</div>
                  <div className="info-value">{game.broadcast}</div>
                </div>
                <div className="info-box">
                  <div className="info-label">Win probability</div>
                  <div className="info-value" style={{ color: "var(--green)" }}>
                    {game.home.abbr} {game.winProbHome.toFixed(1)}%
                  </div>
                  <div className="info-sub">
                    {game.away.abbr} {(100 - game.winProbHome).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Series tracker */}
              {game.seriesTracker && (
                <div className="series-tracker">
                  {game.seriesTracker.map((sg) => (
                    <div
                      key={sg.label}
                      className={`series-game${sg.isNow ? " now" : ""}`}
                    >
                      <div className="series-game-label">{sg.label}</div>
                      <div
                        className="series-game-result"
                        style={{
                          color: sg.isNow
                            ? "var(--green)"
                            : sg.winnerAbbr === game.home.abbr
                              ? game.home.color
                              : sg.winnerAbbr
                                ? "var(--text)"
                                : "var(--text3)",
                        }}
                      >
                        {sg.isNow ? "● TODAY" : (sg.result ?? "TBD")}
                      </div>
                      <div style={{ fontSize: 9, color: "var(--text3)" }}>
                        {sg.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Answer-style summary (StatMuse-inspired): the takeaway
                in one readable sentence before any tables. */}
            <p className="answer-line">
              <strong>
                {game.away.shortName}{" "}
                {game.sport === "ufc" || game.sport === "worldcup"
                  ? "vs"
                  : "at"}{" "}
                {game.home.shortName}
              </strong>{" "}
              — {game.contextLabel ?? game.league}, <LocalTime utc={game.startTimeUTC} fallback={game.startTimeLocal} /> on{" "}
              {game.broadcast}. Our model makes{" "}
              <strong>
                {favorite.shortName} the favorite at {favProb.toFixed(1)}%
              </strong>
              , leaning on {game.prediction.factors[0].name.toLowerCase()}.
              Full reasoning in the Prediction tab.
            </p>

            <GameTabs game={game} />

            <AdSlot id="below-tabs" />

            {/* Internal links (StatMuse "Related searches" pattern) */}
            {otherGames.length > 0 && (
              <section style={{ marginTop: 8 }}>
                <div className="section-h">More matchups today</div>
                {otherGames.slice(0, 4).map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
                <Link
                  href="/"
                  style={{
                    color: "var(--blue)",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  See all games →
                </Link>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
