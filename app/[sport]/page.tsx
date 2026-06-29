import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getSports, getTodaysGames, getRecentResults, isValidSport } from "@/lib/api";

// Refresh live scores/odds every 10 minutes (ISR-write-friendly)
export const revalidate = 600;

interface Props {
  params: Promise<{ sport: string }>;
}

export async function generateStaticParams() {
  const sports = await getSports();
  return sports.map((s) => ({ sport: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport } = await params;
  const sports = await getSports();
  const s = sports.find((x) => x.id === sport);
  if (!s) return {};
  const noun =
    s.id === "ufc"
      ? "Fights"
      : s.id === "worldcup" || s.id === "soccer"
        ? "Matches"
        : "Games";
  return {
    title: `${s.label} ${noun} Today — Predictions, Stats & Matchups`,
    description: `Today's ${s.label} ${noun.toLowerCase()} with stats, head-to-head history, injury reports, and win probability predictions.`,
    alternates: { canonical: `https://matchuplens.com/${sport}` },
  };
}

export default async function SportPage({ params }: Props) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const sports = await getSports();
  const sportInfo = sports.find((s) => s.id === sport)!;
  const noun =
    sport === "ufc"
      ? "fights"
      : sport === "worldcup" || sport === "soccer"
        ? "matches"
        : "games";

  const [allGames, recentResults] = await Promise.all([
    getTodaysGames(sport),
    getRecentResults(sport, 7),
  ]);

  // Drop stale finals from previous days (same filter as homepage)
  const todayET = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const games = allGames.filter((g) => {
    if (g.status !== "final" && g.status !== "cancelled") return true;
    const gameDay = new Date(g.startTimeUTC).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    return gameDay >= todayET;
  });

  // Determine if any game is actually scheduled for today
  const gamesAreToday = games.some((g) => {
    const gameDay = new Date(g.startTimeUTC).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    return gameDay === todayET;
  });
  const sectionLabel = gamesAreToday ? `Today's ${noun}` : `Upcoming ${noun}`;

  return (
    <>
      <main className="container" style={{ padding: "24px 16px" }}>
        <h1 className="page-title">
          {sportInfo.label} {noun.charAt(0).toUpperCase() + noun.slice(1)}
        </h1>
        <p className="page-sub">
          {games.length === 0 && !sportInfo.inSeason
            ? `${sportInfo.label} is currently in the offseason. Check back when ${noun} resume.`
            : games.length === 0
              ? `No ${sportInfo.label} ${noun} are scheduled right now. Check back soon.`
              : gamesAreToday
                ? `${sportInfo.label} ${noun} for today — stats, history, and predictions.`
                : `Upcoming ${sportInfo.label} ${noun} — stats, history, and predictions.`}
        </p>

        {/* Games section — "Today's" only when games are actually today */}
        {games.length > 0 && (
          <div className="section-h" style={{ marginBottom: 12 }}>
            {sectionLabel}
          </div>
        )}
        {games.length > 0 ? (
          games.map((g) => <GameCard key={g.id} game={g} />)
        ) : (
          <div className="panel" style={{ color: "var(--text2)" }}>
            {sportInfo.inSeason
              ? `No ${sportInfo.label} ${noun} scheduled today.`
              : `${sportInfo.label} is in the offseason — no ${noun} scheduled yet.`}
          </div>
        )}

        {/* Recent results — past 7 days */}
        {/* Newsletter — compact variant between games list and recent results */}
        <NewsletterSignup compact />

        {recentResults.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text1)",
                marginBottom: 4,
              }}
            >
              Recent Results
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text3)",
                marginBottom: 16,
              }}
            >
              Final scores from the past 7 days — click any game for full stats and analysis.
            </p>
            {recentResults.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </section>
        )}

        {/* Evergreen hub content — keeps the category page substantive (and
            indexable) even on quiet days, with internal links to the guides. */}
        <section className="panel" style={{ marginTop: 40, lineHeight: 1.8 }}>
          <div className="section-h" style={{ marginBottom: 8 }}>
            About {sportInfo.label} predictions on MatchupLens
          </div>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>
            For every {sportInfo.label} {noun.replace(/s$/, "")}, MatchupLens brings
            the matchup into one view: each side&rsquo;s record and key stats,
            head-to-head history, the latest injury report, the betting-market
            line, and a transparent win-probability estimate with a plain-English
            breakdown of why it leans the way it does.{" "}
            {sportInfo.inSeason
              ? `Today's ${sportInfo.label} slate is up top — check back through the day as scores and lines update.`
              : `${sportInfo.label} is between games right now; this page fills with matchups automatically as soon as the schedule returns.`}
          </p>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 10 }}>
            New to the numbers? Read{" "}
            <Link href="/guides/how-to-read-win-probability" style={{ color: "var(--blue)" }}>
              how to read a win probability
            </Link>{" "}
            and{" "}
            <Link href="/guides/sports-betting-odds-explained" style={{ color: "var(--blue)" }}>
              how betting odds work
            </Link>
            , or browse the full{" "}
            <Link href="/glossary" style={{ color: "var(--blue)" }}>glossary</Link>. Our
            full approach is documented on the{" "}
            <Link href="/methodology" style={{ color: "var(--blue)" }}>methodology page</Link>.
          </p>
        </section>
      </main>
    </>
  );
}
