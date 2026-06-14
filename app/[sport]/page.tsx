import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GameCard } from "@/components/GameCard";
import { getSports, getTodaysGames, getRecentResults, isValidSport } from "@/lib/api";

// Refresh live scores/odds every 60 seconds
export const revalidate = 60;

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

  const [games, recentResults] = await Promise.all([
    getTodaysGames(sport),
    getRecentResults(sport, 7),
  ]);

  return (
    <>
      <main className="container" style={{ padding: "24px 16px" }}>
        <h1 className="page-title">
          {sportInfo.label} {noun.charAt(0).toUpperCase() + noun.slice(1)}
        </h1>
        <p className="page-sub">
          {!sportInfo.inSeason && games.length === 0
            ? `${sportInfo.label} is currently in the offseason. Check back when games resume.`
            : !sportInfo.inSeason && games.length > 0
              ? `Upcoming ${sportInfo.label} ${noun} — stats, history, and predictions.`
              : games.length === 0
                ? `No ${sportInfo.label} ${noun} scheduled right now. Check back soon.`
                : games.every((g) => g.dateLabel === games[0].dateLabel)
                  ? `${sportInfo.label} matchups for ${games[0].dateLabel} — stats, history, and predictions.`
                  : `Upcoming ${sportInfo.label} matchups — stats, history, and predictions.`}
        </p>

        {/* Today / upcoming games */}
        {games.length > 0 ? (
          games.map((g) => <GameCard key={g.id} game={g} />)
        ) : (
          <div className="panel" style={{ color: "var(--text2)" }}>
            Nothing scheduled today.
          </div>
        )}

        {/* Recent results — past 7 days */}
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
      </main>
    </>
  );
}
