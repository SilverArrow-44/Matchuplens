import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "World Cup 2026 Guide — Format, Schedule, Host Cities & How It Works",
  description:
    "A complete guide to the 2026 FIFA World Cup: the new 48-team format, the 12 groups, the full schedule from group stage to final, all 16 host cities across the USA, Canada and Mexico, and how the knockout rounds work.",
  alternates: { canonical: "https://matchuplens.com/guides/world-cup-2026" },
};

export default function WorldCup2026GuidePage() {
  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <h1 className="page-title">The 2026 FIFA World Cup: A Complete Guide</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        The biggest World Cup ever — 48 teams, three host nations, and a brand-new
        format. Here&rsquo;s how the whole tournament works, from the group stage
        to the final in New York/New Jersey.
      </p>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">The basics</div>
        <p style={{ color: "var(--text2)" }}>
          The 2026 FIFA World Cup runs from <strong>June 11 to July 19, 2026</strong>,
          and is the first to be co-hosted by three countries — the{" "}
          <strong>United States, Canada, and Mexico</strong>. It&rsquo;s also the
          first 48-team World Cup, expanded from the 32-team format used since 1998.
          That means more nations, more matches (104 in total), and a longer run to
          the trophy.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">The new format: 12 groups of four</div>
        <p style={{ color: "var(--text2)" }}>
          The 48 teams are drawn into <strong>12 groups of four</strong>. Each team
          plays the other three in its group once. The{" "}
          <strong>top two from every group</strong> advance, plus the{" "}
          <strong>eight best third-placed teams</strong> — sending 32 teams into a
          new Round of 32 knockout stage. From there it&rsquo;s straight
          single-elimination: a loss ends your tournament.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">The schedule, stage by stage</div>
        <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 2 }}>
          <li><strong>Group stage:</strong> June 11 &ndash; June 27</li>
          <li><strong>Round of 32:</strong> June 28 &ndash; July 3</li>
          <li><strong>Round of 16:</strong> July 4 &ndash; July 7</li>
          <li><strong>Quarterfinals:</strong> July 9 &ndash; July 11</li>
          <li><strong>Semifinals:</strong> July 14 &ndash; July 15</li>
          <li><strong>Third-place match:</strong> July 18</li>
          <li><strong>Final:</strong> July 19</li>
        </ul>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Where it&rsquo;s played: 16 host cities</div>
        <p style={{ color: "var(--text2)" }}>
          Matches are spread across <strong>16 cities</strong> — 11 in the United
          States, 3 in Mexico, and 2 in Canada — grouped into three regions to cut
          down on travel:
        </p>
        <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 1.9 }}>
          <li><strong>West:</strong> Vancouver, Seattle, San Francisco Bay Area, Los Angeles</li>
          <li><strong>Central:</strong> Guadalajara, Mexico City, Monterrey, Houston, Dallas, Kansas City</li>
          <li><strong>East:</strong> Atlanta, Miami, Toronto, Boston, Philadelphia, New York/New Jersey</li>
        </ul>
        <p style={{ color: "var(--text2)" }}>
          The <strong>final</strong> is on <strong>Sunday, July 19, 2026</strong> at
          the New York/New Jersey stadium, in front of a crowd of around 82,500.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">How knockout matches are decided</div>
        <p style={{ color: "var(--text2)" }}>
          In the group stage a match can end in a draw — each team takes a point.
          From the Round of 32 onward there are no draws: if the score is level
          after 90 minutes, the match goes to <strong>30 minutes of extra time</strong>,
          and if it&rsquo;s still tied, to a <strong>penalty shootout</strong>.
          That&rsquo;s worth keeping in mind when reading any win-probability
          estimate for a knockout game.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 20, lineHeight: 1.8 }}>
        <div className="panel-title">Following the tournament on MatchupLens</div>
        <p style={{ color: "var(--text2)" }}>
          For every World Cup fixture we put the two sides head-to-head: recent
          form, the betting market line, a win-probability estimate, and a written
          breakdown of the matchup. One note on soccer specifically — our model
          estimates win/loss probability and does not separately price the draw,
          so for group games treat it as a two-way lean rather than a full
          three-way market. See live and upcoming fixtures on the{" "}
          <Link href="/worldcup" style={{ color: "var(--blue)" }}>
            World Cup 2026 page
          </Link>
          .
        </p>
      </div>

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16 }}>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>
          Tournament details are based on FIFA&rsquo;s published format and
          schedule and may be subject to change. Predictions on MatchupLens are
          editorial analysis for entertainment only — not betting advice. 21+ where
          applicable.{" "}
          <Link href="/glossary" style={{ color: "var(--blue)" }}>
            New to the terms? See our glossary →
          </Link>
        </p>
      </div>
    </main>
  );
}
