import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — MatchupLens",
  description: "MatchupLens affiliate and sponsorship disclosure.",
};

export default function AffiliateDisclosurePage() {
  return (
    <article>
      <h1 className="page-title">Affiliate Disclosure</h1>
      <p className="page-sub">Last updated: June 2026</p>

      <div className="panel" style={{ marginTop: 24, lineHeight: 1.8 }}>
        <div className="storyline" style={{ borderLeftColor: "var(--blue)", marginBottom: 24 }}>
          <strong>Short version:</strong> Some links on MatchupLens are affiliate links.
          If you sign up through them, we may earn a commission — at no cost to you.
          This never influences our predictions or editorial content.
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>What Is an Affiliate Link?</h2>
        <p style={{ marginBottom: 16 }}>
          An affiliate link is a tracked URL that lets our partners know a visitor came from
          MatchupLens. If you click one of these links and sign up or make a qualifying deposit,
          MatchupLens may receive a commission from the partner. You pay nothing extra — the
          commission comes from the partner, not from you.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Our Affiliate Partners</h2>
        <p style={{ marginBottom: 8 }}>MatchupLens may have affiliate relationships with:</p>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>DraftKings</strong> — sportsbook and daily fantasy. Only shown in states where legally available.</li>
          <li><strong>FanDuel</strong> — sportsbook and daily fantasy. Only shown in states where legally available.</li>
          <li><strong>Underdog Fantasy</strong> — daily fantasy sports. Available in most US states.</li>
        </ul>
        <p style={{ marginBottom: 16 }}>
          Affiliate CTAs on this site are labeled <strong>&ldquo;Sponsored&rdquo;</strong> or
          marked with disclosure text. Sportsbook offers are only displayed in states where online
          sports betting is legally permitted.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Editorial Independence</h2>
        <p style={{ marginBottom: 16 }}>
          Affiliate relationships do not influence our predictions, win probability models, team
          stats, or any editorial content. Our model is fully automated and is not adjusted based
          on which team or outcome benefits our partners. We would never alter predictions for
          commercial gain.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>FTC Compliance</h2>
        <p style={{ marginBottom: 16 }}>
          In accordance with the Federal Trade Commission&rsquo;s guidelines on endorsements and
          testimonials (16 CFR Part 255), we disclose that MatchupLens may receive compensation
          through affiliate links. This disclosure applies site-wide.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Questions</h2>
        <p>
          Questions about our affiliate relationships?{" "}
          <Link href="/legal/contact" style={{ color: "var(--blue)" }}>Contact us</Link>.
        </p>
      </div>
    </article>
  );
}
