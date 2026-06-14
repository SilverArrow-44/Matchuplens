"use client";

import { useEffect, useRef } from "react";

const BEEHIIV_FORM_ID = "c2e2ed48-99ea-40e5-b0a0-141acc61603a";

interface Props {
  /** Compact single-line variant for sport/game pages. Default is full card. */
  compact?: boolean;
}

export function NewsletterSignup({ compact = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Avoid double-injecting if component re-mounts
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    script.async = true;
    script.setAttribute("data-beehiiv-form", BEEHIIV_FORM_ID);
    containerRef.current.appendChild(script);
  }, []);

  if (compact) {
    return (
      <div className="newsletter-compact">
        <div className="newsletter-compact-text">
          <span className="newsletter-icon">📬</span>
          <div>
            <div className="newsletter-compact-title">Get daily matchup picks</div>
            <div className="newsletter-compact-sub">Win probability + top edges before tip-off — free.</div>
          </div>
        </div>
        <div ref={containerRef} className="newsletter-embed" />
      </div>
    );
  }

  return (
    <div className="newsletter-card">
      <div className="newsletter-header">
        <span className="newsletter-icon">📬</span>
        <div>
          <div className="newsletter-title">Get today&rsquo;s top matchups</div>
          <div className="newsletter-sub">
            Win probability, key stats, and our model&rsquo;s picks for every game —
            delivered free before tip-off.
          </div>
        </div>
      </div>
      <div ref={containerRef} className="newsletter-embed" />
      <p className="newsletter-fine">
        No spam. Unsubscribe any time. Powered by{" "}
        <a href="https://beehiiv.com" target="_blank" rel="noopener noreferrer"
          style={{ color: "var(--text3)" }}>
          Beehiiv
        </a>.
      </p>
    </div>
  );
}
