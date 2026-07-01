import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TeamBadge } from "@/components/TeamBadge";
import { LocalTime } from "@/components/LocalTime";
import { getMatchup, isValidSport } from "@/lib/api";
import type { TeamRef } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ sport: string; matchup: string }>;
}

const LEAGUE_LABELS: Record<string, string> = {
  nba: "NBA", wnba: "WNBA", nfl: "NFL", mlb: "MLB", nhl: "NHL",
  ncaaf: "College Football", ncaab: "College Basketball", soccer: "MLS",
  worldcup: "World Cup 2026", ufc: "UFC",
};

function splitSlugs(matchup: string): [string, string] | null {
  const i = matchup.indexOf("-vs-");
  if (i < 1) return null;
  return [matchup.slice(0, i), matchup.slice(i + 4)];
}

function asTeam(t: TeamRef) {
  return { ...t, record: "" };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, matchup } = await params;
  if (!isValidSport(sport)) return {};
  const pair = splitSlugs(matchup);
  if (!pair) return {};
  const data = await getMatchup(sport, pair[0], pair[1]);
  if (!data) return {};
  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  return {
    title: `${data.teamA.name} vs ${data.teamB.name} — Head-to-Head & Prediction`,
    description: `${data.teamA.name} vs ${data.teamB.name} ${league} matchup: head-to-head history, recent form, team comparison, and win-probability prediction for their next meeting.`,
    alternates: { canonical: `https://matchuplens.com/${sport}/matchup/${data.teamA.slug}-vs-${data.teamB.slug}` },
  };
}

export default async function MatchupPage({ params }: Props) {
  const { sport, matchup } = await params;
  if (!isValidSport(sport)) notFound();
  const pair = splitSlugs(matchup);
  if (!pair) notFound();
  const data = await getMatchup(sport, pair[0], pair[1]);
  if (!data) notFound();

  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  const { teamA, teamB, dataA, dataB, h2h, upcoming } = data;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://matchuplens.com/" },
      { "@type": "ListItem", position: 2, name: league, item: `https://matchuplens.com/${sport}` },
      { "@type": "ListItem", position: 3, name: `${teamA.shortName} vs ${teamB.shortName}`, item: `https://matchuplens.com/${sport}/matchup/${teamA.slug}-vs-${teamB.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <main className="container" style={{ padding: "24px 16px", maxWidth: 860 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, marginBottom: 16 }}>
          <Link href="/" style={{ color: "var(--text3)" }}>Home</Link>
          <span style={{ color: "var(--text3)" }}> / </span>
          <Link href={`/${sport}`} style={{ color: "var(--blue)", fontWeight: 600 }}>{league}</Link>
          <span style={{ color: "var(--text3)" }}> / {teamA.shortName} vs {teamB.shortName}</span>
        </nav>

        <h1 className="page-title" style={{ marginBottom: 6 }}>
          {teamA.name} vs {teamB.name}
        </h1>
        <p className="page-sub" style={{ marginBottom: 20 }}>
          Head-to-head history, form, and our model&rsquo;s take on this {league} matchup.
        </p>

        {/* Team comparison */}
        <div className="hero-matchup" style={{ marginBottom: 20 }}>
          <div className="hero-team">
            <TeamBadge team={asTeam(teamA)} />
            <Link href={`/${sport}/team/${teamA.slug}`} className="hero-team-name" style={{ color: "var(--blue)" }}>
              {teamA.name}
            </Link>
            <div className="hero-team-record">{dataA?.record ?? ""}</div>
          </div>
          <div className="hero-vs">VS</div>
          <div className="hero-team">
            <TeamBadge team={asTeam(teamB)} />
            <Link href={`/${sport}/team/${teamB.slug}`} className="hero-team-name" style={{ color: "var(--blue)" }}>
              {teamB.name}
            </Link>
            <div className="hero-team-record">{dataB?.record ?? ""}</div>
          </div>
        </div>

        {/* Upcoming meeting */}
        {upcoming && (
          <div className="panel" style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>
              Next meeting
            </div>
            <div style={{ margin: "6px 0", fontWeight: 700 }}>
              {upcoming.dateLabel} · <LocalTime utc={upcoming.startTimeUTC} fallback="" />
            </div>
            <Link href={`/${sport}/${upcoming.slug}`} style={{ color: "var(--blue)", fontWeight: 700 }}>
              Full prediction &amp; matchup preview →
            </Link>
          </div>
        )}

        {/* Head-to-head */}
        <div className="section-h" style={{ marginBottom: 10 }}>Head-to-head</div>
        {h2h.games.length > 0 ? (
          <>
            <div className="h2h-summary">
              <div style={{ textAlign: "center" }}>
                <div className="h2h-wins" style={{ color: teamA.color }}>{h2h.homeWins}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{teamA.abbr}</div>
              </div>
              <div className="h2h-dash">—</div>
              <div style={{ textAlign: "center" }}>
                <div className="h2h-wins">{h2h.awayWins}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{teamB.abbr}</div>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginBottom: 12 }}>
              {h2h.windowLabel}
            </div>
            <div className="panel" style={{ padding: "4px 8px", marginBottom: 8 }}>
              {h2h.games.map((g, i) => (
                <div className="h2h-game" key={i}>
                  <span className="h2h-date">{g.date}</span>
                  <span style={{ color: "var(--text3)", fontSize: 12 }}>{g.location}</span>
                  <span className="h2h-score">{g.score}</span>
                  <span className="win-tag">{g.winnerAbbr}</span>
                </div>
              ))}
            </div>
            {h2h.trend && (
              <div className="storyline" style={{ marginBottom: 20 }}>
                <strong>Trend:</strong> {h2h.trend}
              </div>
            )}
          </>
        ) : (
          <div className="panel" style={{ color: "var(--text2)", marginBottom: 20 }}>
            No recent head-to-head meetings found between these teams in the available data.
          </div>
        )}

        {/* Internal links + disclaimer */}
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
          Team hubs:{" "}
          <Link href={`/${sport}/team/${teamA.slug}`} style={{ color: "var(--blue)" }}>{teamA.name}</Link>
          {" · "}
          <Link href={`/${sport}/team/${teamB.slug}`} style={{ color: "var(--blue)" }}>{teamB.name}</Link>.
          See all{" "}
          <Link href={`/${sport}`} style={{ color: "var(--blue)" }}>{league} games</Link> and our{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>methodology</Link>.
        </p>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 12, lineHeight: 1.6 }}>
          Data sourced from ESPN and may be delayed or estimated. Not affiliated with
          ESPN, any league, or any team. Predictions are informational only — not
          betting advice.
        </p>
      </main>
    </>
  );
}
