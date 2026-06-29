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
import { getGameBySlug, getTodaysGames, isValidSport } from "@/lib/api";

// Revalidate hourly. Game pages are the dominant ISR-write source (one cache
// entry per matchup × every crawl that finds it stale), so a long interval is
// the biggest lever for staying under the free-tier ISR-write limit. A finished
// game never changes; a pre-game page's odds move slowly. Trade-off: the live
// score on an individual game page can lag up to ~1 hour (the homepage and
// sport pages carry the same data on the same interval).
export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ sport: string; slug: string }>;
}

// Render game pages on-demand (dynamicParams) rather than pre-building every
// matchup on each deploy — that build-time pre-render seeds an ISR write per
// page on every deployment. They still cache on first request and are listed
// in the sitemap, so SEO is unaffected.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const game = await getGameBySlug(sport, slug);
  if (!game) return {};
  // Use FULL team names + "Prediction & Analysis" — this matches how people
  // actually search (e.g. "cleveland browns @ jacksonville jaguars prediction
  // analysis"), which the old short-name title was missing.
  const title = `${game.away.name} vs ${game.home.name} Prediction & Analysis`;
  const favTeam = game.winProbHome >= 50 ? game.home : game.away;
  const favPct = (game.winProbHome >= 50 ? game.winProbHome : 100 - game.winProbHome).toFixed(0);
  const description = `${game.away.name} vs ${game.home.name} ${game.league} prediction for ${game.dateLabel}. Our model favors ${favTeam.shortName} (${favPct}%). Team stats, head-to-head history, injury report, and full analysis.`;
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

  // Same-sport slate only — avoids fanning out an ESPN call across all 9 sports
  // on every game-page render just to fill the "More matchups today" footer.
  const otherGames = (await getTodaysGames(sport)).filter((g) => g.id !== game.id);
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
  // Estimated end (~3h after start) — schema wants an endDate window.
  const endDate = new Date(
    new Date(game.startTimeUTC).getTime() + 3 * 60 * 60 * 1000
  ).toISOString();
  const eventStatus =
    game.status === "cancelled"
      ? "https://schema.org/EventCancelled"
      : game.status === "postponed"
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled";
  const teams = [
    { "@type": "SportsTeam", name: game.away.name },
    { "@type": "SportsTeam", name: game.home.name },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${game.away.name} vs ${game.home.name}`,
    description: game.contextLabel ?? game.league,
    // Must be ISO-8601 for Google to validate the rich result.
    startDate: game.startTimeUTC,
    endDate,
    eventStatus,
    image: ["https://matchuplens.com/og-image.png"],
    location: {
      "@type": "Place",
      name: game.venue,
      address: game.city,
    },
    competitor: teams,
    performer: teams,
    organizer: { "@type": "SportsOrganization", name: game.league },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://matchuplens.com/" },
      { "@type": "ListItem", position: 2, name: game.league, item: `https://matchuplens.com/${sport}` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${game.away.shortName} vs ${game.home.shortName}`,
        item: `https://matchuplens.com/${sport}/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="container">
        <div className="page-grid">
          <Sidebar game={game} />
          <div>
            {/* Breadcrumb — gives Google a crawlable link to the category hub */}
            <nav aria-label="Breadcrumb" style={{ fontSize: 13, marginBottom: 14 }}>
              <Link href="/" style={{ color: "var(--text3)" }}>Home</Link>
              <span style={{ color: "var(--text3)" }}> / </span>
              <Link href={`/${sport}`} style={{ color: "var(--blue)", fontWeight: 600 }}>
                {game.league}
              </Link>
              <span style={{ color: "var(--text3)" }}> / {game.away.shortName} vs {game.home.shortName}</span>
            </nav>

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
                  {isFinal ? (
                    <div className="info-sub">{game.venue}</div>
                  ) : (
                    <div className="info-date">{game.dateLabel}</div>
                  )}
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
                  href={`/${sport}`}
                  style={{
                    color: "var(--blue)",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  All {game.league} games →
                </Link>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
