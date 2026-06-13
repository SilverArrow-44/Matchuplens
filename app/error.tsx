"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error-reporting service in the future (e.g. Sentry)
    console.error("Page error:", error);
  }, [error]);

  return (
    <main
      className="container"
      style={{ padding: "64px 16px", textAlign: "center" }}
    >
      <h1 className="page-title">Something went wrong</h1>
      <p className="page-sub" style={{ marginBottom: 24 }}>
        We couldn&rsquo;t load this page — the data feed may be temporarily
        unavailable. Live sports data sometimes has brief outages.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={reset}
          style={{
            background: "var(--blue)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            color: "var(--blue)",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 0",
          }}
        >
          Back to today&rsquo;s games →
        </Link>
      </div>
    </main>
  );
}
