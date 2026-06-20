import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — MatchupLens",
  description: "How MatchupLens collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="page-title">Privacy Policy</h1>
      <p className="page-sub">Last updated: June 2026</p>

      <div className="panel" style={{ marginTop: 24, lineHeight: 1.8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>1. Information We Collect</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens does not require account registration or collect personal information to use the site.
          We collect limited non-personal data automatically:
        </p>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>Analytics data</strong> — page views, session duration, referral source via Google Analytics (GA4). This data is anonymized and aggregated.</li>
          <li><strong>Local storage</strong> — your theme preference (dark/light) and geolocation state (used to determine betting CTA eligibility) are stored locally in your browser. This data never leaves your device.</li>
          <li><strong>Geolocation</strong> — we call ipapi.co to determine your US state for the purpose of hiding sportsbook affiliate links in states where sports betting is not legal. Your IP address is sent to ipapi.co per their <a href="https://ipapi.co/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>privacy policy</a>. The result is cached in your browser for 24 hours.</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>2. How We Use Your Information</h2>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li>To understand how visitors use the site and improve the product</li>
          <li>To determine appropriate affiliate offer display based on your location</li>
          <li>We do not sell, rent, or share your data with third parties for marketing purposes</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>3. Third-Party Services</h2>
        <p style={{ marginBottom: 8 }}>We use the following third-party services:</p>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li><strong>Google Analytics</strong> — traffic analysis. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>Google Privacy Policy</a>.</li>
          <li><strong>ESPN Public API</strong> — sports data. No user data is shared with ESPN.</li>
          <li><strong>ipapi.co</strong> — IP-based geolocation for affiliate compliance.</li>
          <li><strong>Vercel</strong> — hosting. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--blue)" }}>Vercel Privacy Policy</a>.</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>4. Cookies</h2>
        <p style={{ marginBottom: 16 }}>
          We use browser localStorage (not cookies) to store your theme preference and geolocation cache. Google Analytics may set cookies per their standard implementation. You can disable cookies in your browser settings at any time.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>5. Children&rsquo;s Privacy</h2>
        <p style={{ marginBottom: 16 }}>
          MatchupLens is intended for users 18 years of age and older (21+ for betting-related content). We do not knowingly collect information from children under 13.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>6. Contact</h2>
        <p>
          For privacy-related questions, contact us at <Link href="/legal/contact" style={{ color: "var(--blue)" }}>our contact page</Link>.
        </p>
      </div>
    </article>
  );
}
