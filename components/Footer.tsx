import Link from "next/link";
import { SPORTS } from "@/lib/sampleData";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ fontWeight: 800, color: "var(--text2)", fontSize: 16 }}>
          MatchupLens
        </div>

        {/* Sports hubs — crawlable links so Google can reach every category page */}
        <nav aria-label="Sports" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 13 }}>
          {SPORTS.map((s) => (
            <Link key={s.id} href={`/${s.id}`} style={{ color: "var(--text2)", fontWeight: 600 }}>
              {s.label}
            </Link>
          ))}
        </nav>
        <div>
          Stats, matchup history, and win probability predictions for every game.
          Predictions are editorial analysis for entertainment purposes only — not betting advice.
        </div>
        <div style={{ color: "var(--red)", fontWeight: 600 }}>
          Gambling problem? Call 1-800-GAMBLER or 1-800-522-4700. 21+ only.
          Sports betting availability varies by state.
        </div>
        {/* Legal links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 13 }}>
          {[
            ["About",                 "/about"],
            ["FAQ",                   "/faq"],
            ["Guides",                "/guides"],
            ["Glossary",              "/glossary"],
            ["Methodology",           "/methodology"],
            ["Privacy Policy",        "/legal/privacy"],
            ["Terms of Service",      "/legal/terms"],
            ["Disclaimer",            "/legal/disclaimer"],
            ["Responsible Gambling",  "/legal/responsible-gambling"],
            ["Affiliate Disclosure",  "/legal/affiliate-disclosure"],
            ["Contact",               "/legal/contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} style={{ color: "var(--text3)" }}>
              {label}
            </a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)" }}>
          Data sourced from ESPN. We may earn a commission from affiliate links on this site.{" "}
          &copy; {year} MatchupLens. Not affiliated with any sports league or team.
        </div>
      </div>
    </footer>
  );
}
