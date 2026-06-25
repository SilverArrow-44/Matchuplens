import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — How MatchupLens Predictions & Stats Work",
  description:
    "Answers to common questions about MatchupLens: how win probability is calculated, where the data comes from, how often it updates, whether predictions are betting advice, and what sports we cover.",
  alternates: { canonical: "https://matchuplens.com/faq" },
};

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is MatchupLens?",
    a: (
      <>
        A free sports matchup site. For every game we combine team stats,
        head-to-head history, injury reports, the betting line, and a transparent
        win-probability estimate into one page, with a plain-English breakdown of
        why the matchup leans the way it does. More on our{" "}
        <Link href="/about" style={{ color: "var(--blue)" }}>about page</Link>.
      </>
    ),
  },
  {
    q: "How is win probability calculated?",
    a: (
      <>
        When a sportsbook moneyline is available, we convert it to an implied
        probability and use that as the base. When it isn&rsquo;t, we estimate
        from each team&rsquo;s win-loss record plus a fixed home-field adjustment.
        It&rsquo;s a transparent, rules-based model — the full method and its
        limitations are on our{" "}
        <Link href="/methodology" style={{ color: "var(--blue)" }}>methodology page</Link>.
      </>
    ),
  },
  {
    q: "Are your predictions betting advice or guaranteed picks?",
    a: (
      <>
        No. Our predictions are editorial analysis for informational and
        entertainment purposes only. No model can guarantee a sports outcome, and
        we never claim to. We don&rsquo;t sell &ldquo;locks&rdquo; or guaranteed
        winners, and we show a confidence level precisely so you can see how
        uncertain a given call is.
      </>
    ),
  },
  {
    q: "Where does the data come from?",
    a: (
      <>
        Scores, records, schedules, injury reports, and betting lines come from
        ESPN&rsquo;s public sports data. ESPN is not affiliated with MatchupLens,
        and we are not affiliated with any league or team.
      </>
    ),
  },
  {
    q: "How often is the data updated?",
    a: (
      <>
        Pages refresh roughly every 5 minutes on the homepage and every 10
        minutes on individual game pages, so scores, lines, and statuses stay
        current through the day without us hammering the data source.
      </>
    ),
  },
  {
    q: "What does the confidence level mean?",
    a: (
      <>
        It reflects how far the favorite&rsquo;s win probability sits from a coin
        flip — not how accurate the call is. High = an edge of 15 points or more,
        Medium = 7&ndash;14 points, Low = under 7 points (essentially a toss-up).
      </>
    ),
  },
  {
    q: "Why does a game show a near 50/50 prediction?",
    a: (
      <>
        Because the inputs genuinely point to a close game — similar records and a
        tight or unavailable market line. We&rsquo;d rather show an honest
        toss-up than manufacture false confidence.
      </>
    ),
  },
  {
    q: "What sports do you cover?",
    a: (
      <>
        NBA, WNBA, NFL, MLB, NHL, UFC, college football, college basketball,
        soccer (MLS), and the 2026 FIFA World Cup. Each sport appears when its
        season is active.
      </>
    ),
  },
  {
    q: "Is MatchupLens free?",
    a: (
      <>
        Yes. We may earn a commission from clearly labelled affiliate links and
        from display ads, but reading the site costs nothing and those
        relationships never affect our analysis.
      </>
    ),
  },
  {
    q: "Do you offer betting tips for sale?",
    a: (
      <>
        No. We don&rsquo;t sell picks, run a tout service, or make guarantees. If
        you choose to bet, do so responsibly, only where legal, and only with
        money you can afford to lose. 21+. Gambling problem? Call 1-800-GAMBLER.
      </>
    ),
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: "See matchuplens.com/faq for the full answer." },
    })),
  };

  return (
    <main className="container" style={{ padding: "40px 16px", maxWidth: 760 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="page-title">Frequently Asked Questions</h1>
      <p className="page-sub" style={{ marginBottom: 28 }}>
        How MatchupLens works — predictions, data, updates, and the fine print.
      </p>

      {FAQS.map((f) => (
        <div key={f.q} className="panel" style={{ marginBottom: 14, lineHeight: 1.8 }}>
          <div className="panel-title" style={{ marginBottom: 6 }}>{f.q}</div>
          <p style={{ color: "var(--text2)" }}>{f.a}</p>
        </div>
      ))}

      <div className="panel" style={{ borderLeft: "3px solid var(--red)", paddingLeft: 16, marginTop: 8 }}>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>
          Predictions are for informational and entertainment purposes only and
          are not betting advice. 21+. Sports betting availability varies by
          state.{" "}
          <Link href="/legal/disclaimer" style={{ color: "var(--blue)" }}>Full disclaimer →</Link>
        </p>
      </div>
    </main>
  );
}
