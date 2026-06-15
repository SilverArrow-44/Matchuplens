"use client";

import { useState } from "react";

const BEEHIIV_URL = "https://matchuplens.beehiiv.com/subscribe";

interface Props {
  compact?: boolean;
}

export function NewsletterSignup({ compact = false }: Props) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = email.trim()
      ? `${BEEHIIV_URL}?email=${encodeURIComponent(email.trim())}`
      : BEEHIIV_URL;
    window.open(url, "_blank", "noopener,noreferrer");
    setEmail("");
  }

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
        <form className="newsletter-compact-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
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
            Win probability and picks for every game — free, before tip-off.
          </div>
        </div>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="newsletter-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="newsletter-btn">Subscribe</button>
      </form>
      <p className="newsletter-fine">No spam. Unsubscribe any time.</p>
    </div>
  );
}
