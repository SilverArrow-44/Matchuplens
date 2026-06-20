"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRIMARY_BOOK, FANTASY } from "@/lib/monetize";

// States where online sports betting is not currently legal.
// DraftKings/FanDuel also geo-gate on their end, but we hide the CTA
// proactively to comply with affiliate ToS and avoid confusion.
// NOTE: betting legality changes — review this list periodically.
// Last reviewed: 2026-06.
const RESTRICTED_BETTING_STATES = new Set([
  "AL", // Alabama
  "AK", // Alaska
  "CA", // California (retail tribal only, no online)
  "GA", // Georgia
  "HI", // Hawaii
  "ID", // Idaho
  "MN", // Minnesota
  "OK", // Oklahoma
  "SC", // South Carolina
  "TX", // Texas
  "UT", // Utah
  "WI", // Wisconsin
]);

// States where Underdog's daily-fantasy (Drafts / Pick'em) is NOT offered, so
// the "Play fantasy on Underdog" CTA would point at something the visitor can't
// use. Source: Underdog's official State Eligibility page (Drafts/Pick'em both
// "Ineligible"). Nevada has no Underdog product at all. Note: these states may
// still offer Underdog's separate "Prediction Picks" product.
// Review periodically — last reviewed: 2026-06.
const RESTRICTED_FANTASY_STATES = new Set([
  "CT", // Connecticut
  "HI", // Hawaii
  "ID", // Idaho
  "IA", // Iowa
  "LA", // Louisiana
  "ME", // Maine
  "MT", // Montana
  "NV", // Nevada (no Underdog product at all)
  "WA", // Washington
]);

// Bumped to v2: cache now stores country too (v1 entries lack it and are ignored).
const GEO_CACHE_KEY = "ml_geo_v2";
const GEO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface GeoCache {
  country: string;
  state: string;
  ts: number;
}

function getCachedGeo(): { country: string; state: string } | null {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const { country, state, ts } = JSON.parse(raw) as GeoCache;
    if (typeof country !== "string" || Date.now() - ts > GEO_TTL_MS) return null;
    return { country, state };
  } catch {
    return null;
  }
}

// Sportsbook CTA is US-only. Allowed only inside the US AND outside a
// restricted state. Everything else (international, restricted, unknown)
// is treated as not-allowed so the sportsbook link never leaks.
function isBettingAllowed(country: string, state: string): boolean {
  return country === "US" && !RESTRICTED_BETTING_STATES.has(state);
}

// Fantasy CTA is US-only and hidden where Underdog DFS isn't offered.
function isFantasyAllowed(country: string, state: string): boolean {
  return country === "US" && !RESTRICTED_FANTASY_STATES.has(state);
}

export function AffiliateCTA({ style }: { style?: React.CSSProperties }) {
  // geo === null until resolved (loading) or if detection failed.
  const [geo, setGeo] = useState<{ country: string; state: string } | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const cached = getCachedGeo();
    if (cached !== null) {
      setGeo(cached);
      setResolved(true);
      return;
    }

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data: { country_code?: string; region_code?: string }) => {
        const next = { country: data.country_code ?? "", state: data.region_code ?? "" };
        try {
          localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ...next, ts: Date.now() }));
        } catch {}
        setGeo(next);
        setResolved(true);
      })
      .catch(() => {
        // Geo failed (ad blocker / VPN / network). Leave geo null and mark
        // resolved: betting stays hidden (fail-closed, legal risk), fantasy
        // stays shown (fail-open, broadly legal) — see derivations below.
        setResolved(true);
      });
  }, []);

  // Betting: fail-closed — only when we positively confirm an allowed US state.
  const bettingAllowed = geo ? isBettingAllowed(geo.country, geo.state) : false;
  // Fantasy: fail-open — show unless we positively know it's a restricted state.
  const fantasyAllowed = geo ? isFantasyAllowed(geo.country, geo.state) : true;

  return (
    <div style={style}>
      {/* Sponsored header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--text3)",
          }}
        >
          Sponsored
        </span>
        <Link
          href="/legal/affiliate-disclosure"
          style={{ fontSize: 10, color: "var(--text3)" }}
        >
          Disclosure
        </Link>
      </div>

      {/* Sportsbook CTA — hidden in restricted states, never shown on geo error */}
      {bettingAllowed && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--red)", marginBottom: 4, letterSpacing: 0.5 }}>
            21+ ONLY · SPORTS BETTING
          </div>
          <a
            className="affiliate-cta"
            href={PRIMARY_BOOK.url}
            rel="nofollow sponsored noopener noreferrer"
            target="_blank"
          >
            {PRIMARY_BOOK.label}
            <span className="affiliate-sub">{PRIMARY_BOOK.sub}</span>
          </a>
        </>
      )}
      {resolved && !bettingAllowed && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text3)",
            textAlign: "center",
            margin: "6px 0",
          }}
        >
          Sports betting not available in your region.
        </p>
      )}

      {/* Fantasy CTA — shown unless we know Underdog DFS isn't offered in-state */}
      {fantasyAllowed && (
        <a
          className="affiliate-cta"
          href={FANTASY.url}
          rel="nofollow sponsored noopener noreferrer"
          target="_blank"
          style={{ background: "var(--blue)", marginTop: 8 }}
        >
          {FANTASY.label}
          <span className="affiliate-sub">{FANTASY.sub}</span>
        </a>
      )}
    </div>
  );
}
