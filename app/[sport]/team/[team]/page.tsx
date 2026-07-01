import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { TeamBadge } from "@/components/TeamBadge";
import { LocalTime } from "@/components/LocalTime";
import { getTeam, isValidSport } from "@/lib/api";
import type { TeamGameRef, TeamRef } from "@/lib/types";

export const revalidate = 3600;
export const dynamicParams = true;

// On-demand — don't pre-render every team on each deploy (ISR-write cost).
export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ sport: string; team: string }>;
}

const LEAGUE_LABELS: Record<string, string> = {
  nba: "NBA", wnba: "WNBA", nfl: "NFL", mlb: "MLB", nhl: "NHL",
  ncaaf: "College Football", ncaab: "College Basketball", soccer: "MLS",
  worldcup: "World Cup 2026", ufc: "UFC",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sport, team } = await params;
  if (!isValidSport(sport)) return {};
  const data = await getTeam(sport, team);
  if (!data) return {};
  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  return {
    title: `${data.team.name} — ${league} Schedule, Results & Predictions`,
    description: `${data.team.name} ${league} hub: record (${data.record}), upcoming games, recent results, recent form, and win-probability predictions for every matchup.`,
    alternates: { canonical: `https://matchuplens.com/${sport}/team/${data.team.slug}` },
  };
}

function asTeam(t: TeamRef) {
  return { ...t, record: "" };
}

function FormPips({ form }: { form: ("W" | "L" | "D")[] }) {
  if (!form.length) return null;
  const color = (r: string) => (r === "W" ? "var(--green)" : r === "L" ? "var(--red)" : "var(--text3)");
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {form.map((r, i) => (
        <span
          key={i}
          style={{
            width: 20, height: 20, borderRadius: 4, display: "inline-flex",
            alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800,
            color: "#fff", background: color(r),
          }}
        >
          {r}
        </span>
      ))}
    </span>
  );
}

function GameRow({ sport, g }: { sport: string; g: TeamGameRef }) {
  const vs = g.isHome ? "vs" : "@";
  return (
    <Link href={`/${sport}/${g.slug}`} className="side-row" style={{ textDecoration: "none" }}>
      <span className="side-label">
        <span style={{ color: "var(--text3)", fontSize: 12 }}>{vs}</span> {g.opponentShort}
      </span>
      <span className="side-value">
        {g.status === "final" && g.result ? (
          <span style={{ color: g.result === "W" ? "var(--green)" : g.result === "L" ? "var(--red)" : "var(--text3)" }}>
            {g.result} {g.teamScore}–{g.oppScore}
          </span>
        ) : (
          <span style={{ color: "var(--text3)", fontSize: 13 }}>
            {g.dateLabel} · <LocalTime utc={g.startTimeUTC} fallback="" />
          </span>
        )}
      </span>
    </Link>
  );
}

export default async function TeamPage({ params }: Props) {
  const { sport, team } = await params;
  if (!isValidSport(sport)) notFound();
  const data = await getTeam(sport, team);
  if (!data) notFound();

  const league = LEAGUE_LABELS[sport] ?? sport.toUpperCase();
  const t = data.team;

  // Distinct opponents for "related matchups" (evergreen) links.
  const opponents = new Map<string, { short: string; slug?: string }>();
  for (const g of [...data.upcoming, ...data.recent]) {
    const key = g.opponentTeamSlug ?? g.opponentShort;
    if (!opponents.has(key)) opponents.set(key, { short: g.opponentShort, slug: g.opponentTeamSlug });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: t.name,
    sport: league,
    url: `https://matchuplens.com/${sport}/team/${t.slug}`,
    ...(t.logo ? { logo: t.logo } : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://matchuplens.com/" },
      { "@type": "ListItem", position: 2, name: league, item: `https://matchuplens.com/${sport}` },
      { "@type": "ListItem", position: 3, name: t.name, item: `https://matchuplens.com/${sport}/team/${t.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <main className="container" style={{ padding: "24px 16px", maxWidth: 900 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, marginBottom: 16 }}>
          <Link href="/" style={{ color: "var(--text3)" }}>Home</Link>
          <span style={{ color: "var(--text3)" }}> / </span>
          <Link href={`/${sport}`} style={{ color: "var(--blue)", fontWeight: 600 }}>{league}</Link>
          <span style={{ color: "var(--text3)" }}> / {t.shortName}</span>
        </nav>

        {/* Hero */}
        <div className="panel" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <TeamBadge team={asTeam(t)} size={64} />
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>{t.name}</h1>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text2)" }}>{data.record}</span>
              {data.form.length > 0 && (
                <>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>Form</span>
                  <FormPips form={data.form} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Splits */}
        <div className="info-strip" style={{ marginTop: 0, marginBottom: 20 }}>
          <div className="info-box">
            <div className="info-label">Overall</div>
            <div className="info-value">{data.record}</div>
          </div>
          <div className="info-box">
            <div className="info-label">Home</div>
            <div className="info-value">{data.homeRecord}</div>
          </div>
          <div className="info-box">
            <div className="info-label">Away</div>
            <div className="info-value">{data.awayRecord}</div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="section-h" style={{ marginBottom: 10 }}>Upcoming games</div>
        {data.upcoming.length > 0 ? (
          <div className="panel" style={{ padding: "4px 8px", marginBottom: 24 }}>
            {data.upcoming.map((g) => <GameRow key={g.eventId} sport={sport} g={g} />)}
          </div>
        ) : (
          <div className="panel" style={{ color: "var(--text2)", marginBottom: 24 }}>
            No upcoming games scheduled right now.
          </div>
        )}

        {/* Recent */}
        <div className="section-h" style={{ marginBottom: 10 }}>Recent results</div>
        {data.recent.length > 0 ? (
          <div className="panel" style={{ padding: "4px 8px", marginBottom: 24 }}>
            {data.recent.map((g) => <GameRow key={g.eventId} sport={sport} g={g} />)}
          </div>
        ) : (
          <div className="panel" style={{ color: "var(--text2)", marginBottom: 24 }}>
            No recent results available.
          </div>
        )}

        {/* Related matchups + teams */}
        {opponents.size > 0 && (
          <>
            <div className="section-h" style={{ marginBottom: 10 }}>Head-to-head matchups</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {[...opponents.entries()].slice(0, 12).map(([key, opp]) =>
                opp.slug ? (
                  <Link
                    key={key}
                    href={`/${sport}/matchup/${t.slug}-vs-${opp.slug}`}
                    className="league-chip"
                    style={{ background: "var(--bg3)", color: "var(--blue)" }}
                  >
                    {t.shortName} vs {opp.short}
                  </Link>
                ) : null
              )}
            </div>
          </>
        )}

        {/* Internal links + disclaimer */}
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8 }}>
          See all{" "}
          <Link href={`/${sport}`} style={{ color: "var(--blue)" }}>{league} games &amp; predictions</Link>,
          how our{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>model works</Link>, and our{" "}
          <Link href="/prediction-accuracy" style={{ color: "var(--blue)" }}>prediction accuracy</Link>.
        </p>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 12, lineHeight: 1.6 }}>
          Schedule and results are sourced from ESPN and may be delayed or estimated.
          Not affiliated with ESPN, any league, or any team. Predictions are
          informational only — not betting advice.
        </p>
      </main>
    </>
  );
}
