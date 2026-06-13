"use client";

import { useState } from "react";

interface Props {
  title: string;   // e.g. "Lakers vs Celtics Prediction"
  url?: string;    // defaults to window.location.href
}

export function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return url ?? (typeof window !== "undefined" ? window.location.href : "");
  }

  function shareTwitter() {
    const text = encodeURIComponent(`${title} — via @MatchupLens`);
    const href = encodeURIComponent(getUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${href}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("input");
      el.value = getUrl();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, letterSpacing: 0.5 }}>
        SHARE
      </span>

      {/* X / Twitter */}
      <button
        onClick={shareTwitter}
        aria-label="Share on X (Twitter)"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text2)",
          cursor: "pointer",
          transition: "border-color 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Post
      </button>

      {/* Copy link */}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: copied ? "var(--green)" : "var(--card)",
          border: `1px solid ${copied ? "var(--green)" : "var(--border)"}`,
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: 13,
          fontWeight: 600,
          color: copied ? "#fff" : "var(--text2)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
