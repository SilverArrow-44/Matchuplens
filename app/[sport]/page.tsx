import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import { GamesRibbon } from "@/components/GamesRibbon";
import { GameCard } from "@/components/GameCard";
import { getSports, getTodaysGames, isValidSport } from "@/lib/api";

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
  };
}

export default async function SportPage({ params }: Props) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const sports = await getSports();
  const sportInfo = sports.find((s) => s.id === sport)!;
  const games = await getTodaysGames(sport);

  return (
    <>
      <Topbar activeSport={sport} />
      <GamesRibbon />
      <main className="container" style={{ padding: "24px 16px" }}>
        <h1 className="page-title">
          {sportInfo.label}{" "}
          {sport === "ufc"
            ? "Fights"
            : sport === "worldcup" || sport === "soccer"
              ? "Matches"
              : "Games"}
        </h1>
        <p className="page-sub">
          {sportInfo.inSeason
            ? `Today's ${sportInfo.label} matchups with stats, history, and predictions.`
            : `${sportInfo.label} is currently in the offseason. Check back when games resume.`}
        </p>
        {games.length > 0 ? (
          games.map((g) => <GameCard key={g.id} game={g} />)
        ) : (
          <div className="panel" style={{ color: "var(--text2)" }}>
            Nothing scheduled today.
          </div>
        )}
      </main>
    </>
  );
}
