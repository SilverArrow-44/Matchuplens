"use client";

import { useEffect } from "react";

// Catches errors thrown in the root layout itself (where the normal
// app/error.tsx boundary can't render). Must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error-reporting service in the future (e.g. Sentry)
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#0d0d0d",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#888", maxWidth: 420, marginBottom: 24 }}>
          We hit an unexpected error. Live sports data sometimes has brief
          outages — please try again.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              background: "#2563eb",
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
          {/* Plain anchor on purpose: the app shell has crashed, so we want a
              full document reload here, not client-side navigation. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{ color: "#60a5fa", fontWeight: 700, fontSize: 14, padding: "10px 0" }}
          >
            Back to today&rsquo;s games →
          </a>
        </div>
      </body>
    </html>
  );
}
