import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — MatchupLens",
  description: "Terms and conditions for using MatchupLens.",
  alternates: { canonical: "https://matchuplens.com/legal/terms" },
};

export default function TermsPage() {
  return (
    <article>
      <h1 className="page-title">Terms of Service</h1>
      <p className="page-sub">Last updated: June 2026</p>

      <div className="panel" style={{ marginTop: 24, lineHeight: 1.8 }}>
        <p style={{ marginBottom: 16 }}>
          By accessing or using MatchupLens (&ldquo;the Site&rdquo;), you agree to these Terms of Service.
          If you do not agree, please do not use the Site.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>1. Use of the Site</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens provides sports statistics, head-to-head history, and win probability predictions
          for informational and entertainment purposes only. You must be 18 years or older (21+ where
          required by law) to access betting-related content on this Site.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>2. Not Betting Advice</h2>
        <p style={{ marginBottom: 16 }}>
          All predictions, win probabilities, and analysis on MatchupLens are <strong>editorial
          opinions and entertainment content only</strong>. Nothing on this Site constitutes
          professional betting advice, financial advice, or a recommendation to place any wager.
          Past model performance does not guarantee future accuracy. You assume full responsibility
          for any betting decisions you make.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>3. Affiliate Relationships</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens participates in affiliate programs with third-party sportsbooks and fantasy
          sports platforms. We may earn a commission when you click affiliate links and sign up for
          their services. This does not affect our editorial content or predictions. See our full
          <Link href="/legal/affiliate-disclosure" style={{ color: "var(--blue)" }}> Affiliate Disclosure</Link>.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>4. Data Accuracy</h2>
        <p style={{ marginBottom: 16 }}>
          Sports data is sourced from third-party APIs and may contain errors, delays, or omissions.
          MatchupLens makes no warranty regarding the accuracy, completeness, or timeliness of any
          data displayed on the Site.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>5. Intellectual Property</h2>
        <p style={{ marginBottom: 16 }}>
          All content, design, and code on MatchupLens is owned by MatchupLens unless otherwise noted.
          Team names, logos, and trademarks are property of their respective owners. MatchupLens is
          not affiliated with, endorsed by, or officially connected to any sports league or team.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>6. Limitation of Liability</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens and its operators shall not be liable for any losses, damages, or expenses
          arising from use of the Site, reliance on predictions, or decisions made based on content
          found here. The Site is provided &ldquo;as is&rdquo; without warranties of any kind.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>7. Changes to Terms</h2>
        <p style={{ marginBottom: 16 }}>
          We reserve the right to update these Terms at any time. Continued use of the Site after
          changes are posted constitutes acceptance of the revised Terms.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>8. Contact</h2>
        <p>Questions about these Terms? <Link href="/legal/contact" style={{ color: "var(--blue)" }}>Contact us</Link>.</p>
      </div>
    </article>
  );
}
