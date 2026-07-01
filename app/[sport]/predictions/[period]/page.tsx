import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { LocalTime } from "@/components/LocalTime";
import { TeamBadge } from "@/components/TeamBadge";
import { getPredictionSlate, isValidSport } from "@/lib/api";
import type { GameDetail } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

const PERIODS = new Set(["today", "this-week"]);

const LEAGUE_LABELS: Record<string, string> = {
  nba: "NBA", wnba: "WNBA", nfl: "NFL", mlb: "MLB", nhl: "NHL",
  ncaaf: "College Football", ncaab: "College Basketball", soccer: "MLS",
  worldcup: "World Cup 2026", ufc: "UFC",
};

interface Props {
  params: Promise<{ sport: string; period: string }>;
}

const STATUS_ORDER: Record<string, number> = { live: 0, scheduled: 1, postponed: 2, final: 3, cancelled: 4 };

function periodLabel(period: string): string {
  return period === "this-week" ? "this week" : "today";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, period } = await params;
  if (!isValidSport(sport) || !PERIODS.has(period)) return {};
  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  const when = periodLabel(period);
  return {
    title: `${league} Predictions ${when === "this week" ? "This Week" : "Today"} — Model Leans & Win Probability`,
    description: `Every ${league} game ${when}: our model's lean, win probability, confidence, and start time, with a link to the full matchup breakdown.`,
    alternates: { canonical: `https://matchuplens.com/${sport}/predictions/${period}` },
  };
}

function PredictionCard({ sport, g }: { sport: string; g: GameDetail }) {
  const favHome = g.winProbHome >= 50;
  const fav = favHome ? g.home : g.away;
  const favPct = (favHome ? g.winProbHome : 100 - g.winProbHome).toFixed(0);
  const confColor =
    g.prediction.confidence === "High" ? "var(--green)"
      : g.prediction.confidence === "Medium" ? "var(--amber, #f59e0b)" : "var(--red)";
  const isFinal = g.status === "final";

  return (
    <Link href={`/${sport}/${g.slug}`} className="game-card" style={{ display: "block" }}>
      <div className="game-card-top">
        <span>{g.contextLabel ?? g.league}</span>
        <span>
          {g.status === "live" ? (
            <span style={{ color: "var(--green)", fontWeight: 700 }}>● {g.period ?? "LIVE"}</span>
          ) : isFinal ? (
            <span style={{ color: "var(--text3)" }}>FINAL</span>
          ) : (
            <span style={{ color: "var(--text2)" }}>
              {g.dateLabel} · <LocalTime utc={g.startTimeUTC} fallback={g.startTimeLocal} />
            </span>
          )}
        </span>
      </div>

      <div className="game-card-teams">
        <div className="game-card-team">
          <TeamBadge team={g.away} size={32} />
          {g.away.shortName}
        </div>
        <span style={{ color: "var(--text3)", fontWeight: 800 }}>
          {sport === "ufc" || sport === "worldcup" ? "vs" : "@"}
        </span>
        <div className="game-card-team">
          {g.home.shortName}
          <TeamBadge team={g.home} size={32} />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 12 }}>
        <span className="prob-pill">
          Model lean: {fav.shortName} {favPct}%
        </span>
        <span
          className="confidence"
          style={{
            background: `color-mix(in srgb, ${confColor} 15%, transparent)`,
            color: confColor,
            borderColor: `color-mix(in srgb, ${confColor} 40%, transparent)`,
          }}
        >
          {g.prediction.confidence} confidence
        </span>
      </div>

      <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 10, lineHeight: 1.6 }}>
        {g.prediction.reasoning}
      </p>
    </Link>
  );
}

export default async function PredictionsHubPage({ params }: Props) {
  const { sport, period } = await params;
  if (!isValidSport(sport) || !PERIODS.has(period)) notFound();

  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  const when = periodLabel(period);

  const games = (await getPredictionSlate(sport)).sort((a, b) => {
    const so = (STATUS_ORDER[a.status] ?? 1) - (STATUS_ORDER[b.status] ?? 1);
    if (so !== 0) return so;
    return new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime();
  });

  const updatedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <main className="container" style={{ padding: "24px 16px" }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: 13, marginBottom: 14 }}>
        <Link href="/" style={{ color: "var(--text3)" }}>Home</Link>
        <span style={{ color: "var(--text3)" }}> / </span>
        <Link href={`/${sport}`} style={{ color: "var(--blue)", fontWeight: 600 }}>{league}</Link>
        <span style={{ color: "var(--text3)" }}> / Predictions</span>
      </nav>

      <h1 className="page-title">
        {league} Predictions — {when === "this week" ? "This Week" : "Today"}
      </h1>
      <p className="page-sub" style={{ marginBottom: 8 }}>
        Every {league} game {when} with our model&rsquo;s lean, win probability, and
        confidence. Tap any game for the full breakdown.
      </p>
      <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 20 }}>
        Last updated {updatedAt} ET · Estimated win probability based on available
        data. Informational only — not betting advice.
      </p>

      {games.length > 0 ? (
        games.map((g) => <PredictionCard key={g.id} sport={sport} g={g} />)
      ) : (
        <div className="panel" style={{ color: "var(--text2)" }}>
          No {league} games {when}. Check back soon, or see{" "}
          <Link href={`/${sport}`} style={{ color: "var(--blue)" }}>all {league} coverage</Link>.
        </div>
      )}

      <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 24, lineHeight: 1.8 }}>
        How the model works:{" "}
        <Link href="/methodology" style={{ color: "var(--blue)" }}>methodology</Link>
        {" · "}
        <Link href="/prediction-accuracy" style={{ color: "var(--blue)" }}>accuracy tracker</Link>.
      </p>
    </main>
  );
}
