import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About MatchupLens — What We Do & Why",
  description:
    "MatchupLens is an independent sports matchup site offering team stats, head-to-head history, injury reports, and transparent win-probability predictions for the NBA, NFL, MLB, NHL, UFC, college sports, soccer, and the 2026 World Cup.",
  alternates: { canonical: "https://matchuplens.com/about" },
};

export default function AboutPage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">About MatchupLens</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        MatchupLens is an independent sports matchup and prediction site built
        for fans who want to understand a game before it starts — not just see
        the final score.
      </p>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">What we do</div>
        <p style={{ color: "var(--text2)" }}>
          For every game on the slate, MatchupLens pulls together the things you
          would otherwise have to gather from five different tabs: each team&rsquo;s
          record and key stats, their head-to-head history, the latest injury
          report, the betting market line, and a clearly-labelled win-probability
          estimate. We then write a plain-English breakdown of why the matchup
          leans the way it does — including the case for the underdog. The goal is
          a single page that answers &ldquo;who&rsquo;s likely to win, and why?&rdquo;
          in under a minute.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Sports we cover</div>
        <p style={{ color: "var(--text2)" }}>
          NBA and WNBA basketball, NFL and college football, MLB baseball, NHL
          hockey, UFC, men&rsquo;s college basketball, soccer (MLS), and the 2026
          FIFA World Cup. Coverage follows each league&rsquo;s season — pages fill
          in automatically when games are scheduled and quiet down in the
          offseason.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Where our data comes from</div>
        <p style={{ color: "var(--text2)" }}>
          Scores, schedules, team records, injury reports, and betting lines are
          sourced from ESPN&rsquo;s public sports data. ESPN is not a sponsor,
          partner, or affiliate of MatchupLens, and we are not affiliated with the
          NBA, NFL, MLB, NHL, UFC, FIFA, or any team or league.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">How our predictions work</div>
        <p style={{ color: "var(--text2)" }}>
          Our win-probability model is transparent and rules-based — no black
          boxes. When a betting market line is available we convert it to an
          implied probability; otherwise we estimate from each team&rsquo;s record
          plus home advantage. We show a confidence level and flag whether our
          pick agrees with the market. The full method, including its
          limitations, is documented on our{" "}
          <Link href="/methodology" style={{ color: "var(--blue)" }}>
            methodology page
          </Link>
          .
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Editorial independence &amp; how we make money</div>
        <p style={{ color: "var(--text2)" }}>
          MatchupLens is free to read. We may earn a commission from clearly
          labelled affiliate links and from display advertising. Those
          relationships never influence our predictions, our analysis, or which
          team we pick — the model runs on data, not on who pays us. See our{" "}
          <Link href="/legal/affiliate-disclosure" style={{ color: "var(--blue)" }}>
            affiliate disclosure
          </Link>{" "}
          for details.
        </p>
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16, lineHeight: 1.7 }}>
        <p style={{ fontSize: 13, color: "var(--text3)" }}>
          <strong>Important:</strong> MatchupLens predictions are editorial
          analysis for informational and entertainment purposes only. They are
          not betting advice and do not guarantee any outcome. If you choose to
          wager, do so responsibly, only where it is legal, and only with money
          you can afford to lose. 21+. Gambling problem? Call 1-800-GAMBLER.{" "}
          <Link href="/legal/responsible-gambling" style={{ color: "var(--blue)" }}>
            Responsible gambling resources →
          </Link>
        </p>
      </div>
    </main>
  );
}
