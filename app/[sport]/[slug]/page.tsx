import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { GameTabs } from "@/components/GameTabs";
import { TeamBadge } from "@/components/TeamBadge";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { AdSlot } from "@/components/AdSlot";
import { LocalTime } from "@/components/LocalTime";
import { MatchupAnalysis } from "@/components/MatchupAnalysis";
import { ShareButtons } from "@/components/ShareButtons";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  getAllGameParams,
  getGameBySlug,
  getTodaysGames,
  isValidSport,
} from "@/lib/api";

// Revalidate every 10 min — still fresh for a prediction site, ~10x fewer ISR writes than 60s
export const revalidate = 600;
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
  return {
    title,
    description,
    alternates: { canonical: `https://matchuplens.com/${sport}/${slug}` },
  };
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

  // For final games: determine winner and whether model was correct
  const isFinal = game.status === "final";
  const homeWon = (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const winnerShort = homeWon ? game.home.shortName : game.away.shortName;
  const modelCorrect = isFinal
    ? (homeWon && game.prediction.pickAbbr === game.home.abbr) ||
      (!homeWon && game.prediction.pickAbbr === game.away.abbr)
    : false;

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
      <main className="container">
        <div className="page-grid">
          <Sidebar game={game} />
          <div>
            {/* ── Final game: recap banner — leads with result, not prediction ── */}
            {isFinal && (
              <div className={`recap-banner${modelCorrect ? " correct" : " incorrect"}`}>
                <div className="recap-score">
                  {game.away.abbr} {game.awayScore} – {game.home.abbr} {game.homeScore}
                </div>
                <div className="recap-result">
                  <span className="recap-label">FINAL</span>
                  <span className="recap-winner">
                    {homeWon ? game.home.name : game.away.name} won
                  </span>
                </div>
                <div className="recap-model">
                  Model picked <strong>{game.prediction.pickTeamName}</strong>{" "}
                  {modelCorrect
                    ? <span style={{ color: "var(--green)" }}>✓ Correct call</span>
                    : <span style={{ color: "var(--red)" }}>✗ Missed this one</span>}
                </div>
              </div>
            )}

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
                  ) : game.status === "postponed" ? (
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--amber, #f59e0b)" }}>POSTPONED</span>
                  ) : game.status === "cancelled" ? (
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--red)" }}>CANCELLED</span>
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
                  <div className="info-label">{isFinal ? "Date" : "Start"}</div>
                  <div className="info-value">
                    {isFinal ? game.dateLabel : <LocalTime utc={game.startTimeUTC} fallback={game.startTimeLocal} />}
                  </div>
                  <div className="info-sub">{isFinal ? game.venue : game.dateLabel}</div>
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
                  <div className="info-label">
                    {isFinal ? "Pregame model" : "Win probability"}
                  </div>
                  <div className="info-value" style={{ color: isFinal ? "var(--text3)" : "var(--green)" }}>
                    {game.home.abbr} {game.winProbHome.toFixed(1)}%
                  </div>
                  <div className="info-sub">
                    {game.away.abbr} {(100 - game.winProbHome).toFixed(1)}%
                    {isFinal && <span style={{ display: "block", fontSize: 10 }}>pre-game estimate</span>}
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

            {/* Share buttons */}
            <div style={{ marginBottom: 20 }}>
              <ShareButtons
                title={`${game.away.shortName} vs ${game.home.shortName} — ${game.league} Prediction`}
              />
            </div>

            {/* Answer-style summary: pre-game prediction OR post-game result */}
            <p className="answer-line">
              {isFinal ? (
                <>
                  <strong>
                    {game.away.shortName} {game.awayScore} –{" "}
                    {game.home.shortName} {game.homeScore}
                  </strong>{" "}
                  — Final · {game.contextLabel ?? game.league}.{" "}
                  <strong>{winnerShort} won.</strong>{" "}
                  Our model picked {game.prediction.pickTeamName} —{" "}
                  {modelCorrect ? "✓ correct call." : "✗ missed this one."}
                </>
              ) : (
                <>
                  <strong>
                    {game.away.shortName}{" "}
                    {game.sport === "ufc" || game.sport === "worldcup"
                      ? "vs"
                      : "at"}{" "}
                    {game.home.shortName}
                  </strong>{" "}
                  — {game.contextLabel ?? game.league},{" "}
                  <LocalTime
                    utc={game.startTimeUTC}
                    fallback={game.startTimeLocal}
                  />{" "}
                  on {game.broadcast}. Our model makes{" "}
                  <strong>
                    {favorite.shortName} the favorite at {favProb.toFixed(1)}%
                  </strong>
                  , leaning on{" "}
                  {game.prediction.factors[0]?.name.toLowerCase() ??
                    "recent form"}
                  . Full reasoning in the Prediction tab.
                </>
              )}
            </p>

            <GameTabs game={game} />

            <AdSlot id="below-tabs" />

            {/* Newsletter — compact, after prediction tab, before analysis */}
            <NewsletterSignup compact />

            <MatchupAnalysis game={game} />

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
