"use client";

import { useEffect, useState } from "react";
import { PRIMARY_BOOK, FANTASY } from "@/lib/monetize";

// States where online sports betting is not currently legal.
// DraftKings/FanDuel also geo-gate on their end, but we hide the CTA
// proactively to comply with affiliate ToS and avoid confusion.
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

const GEO_CACHE_KEY = "ml_geo_v1";
const GEO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCachedState(): string | null {
  try {
    const raw = localStorage.getItem(GEO_CACHE_KEY);
    if (!raw) return null;
    const { state, ts } = JSON.parse(raw) as { state: string; ts: number };
    if (Date.now() - ts > GEO_TTL_MS) return null;
    return state;
  } catch {
    return null;
  }
}

export function AffiliateCTA({ style }: { style?: React.CSSProperties }) {
  // null = loading, true = betting allowed, false = restricted
  const [bettingAllowed, setBettingAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const cached = getCachedState();
    if (cached !== null) {
      setBettingAllowed(!RESTRICTED_BETTING_STATES.has(cached));
      return;
    }

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data: { region_code?: string }) => {
        const state = data.region_code ?? "";
        try {
          localStorage.setItem(
            GEO_CACHE_KEY,
            JSON.stringify({ state, ts: Date.now() })
          );
        } catch {}
        setBettingAllowed(!RESTRICTED_BETTING_STATES.has(state));
      })
      .catch(() => {
        // On any error (ad blocker, network) default to showing the CTA —
        // DraftKings will reject ineligible users on their end.
        setBettingAllowed(true);
      });
  }, []);

  return (
    <div style={style}>
      {/* Sportsbook CTA — hidden in restricted states */}
      {bettingAllowed === true && (
        <a
          className="affiliate-cta"
          href={PRIMARY_BOOK.url}
          rel="nofollow sponsored"
          target="_blank"
        >
          {PRIMARY_BOOK.label}
          <span className="affiliate-sub">{PRIMARY_BOOK.sub}</span>
        </a>
      )}
      {bettingAllowed === false && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text3)",
            textAlign: "center",
            margin: "6px 0",
          }}
        >
          Sports betting not available in your state.
        </p>
      )}

      {/* Fantasy CTA — legal in ~45 states, always shown */}
      <a
        className="affiliate-cta"
        href={FANTASY.url}
        rel="nofollow sponsored"
        target="_blank"
        style={{ background: "var(--blue)", marginTop: 8 }}
      >
        {FANTASY.label}
        <span className="affiliate-sub">{FANTASY.sub}</span>
      </a>
    </div>
  );
}
