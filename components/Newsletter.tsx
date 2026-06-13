import { NEWSLETTER_ACTION } from "@/lib/monetize";

// Email capture — the long-term asset. Works with any form-action provider
// (Buttondown, Mailchimp, ConvertKit): set NEXT_PUBLIC_NEWSLETTER_ACTION.
// Renders nothing until configured, so no broken forms ship.
export function Newsletter() {
  if (!NEWSLETTER_ACTION) return null;
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <div className="panel-title">Free daily picks</div>
      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 10 }}>
        Every morning: the day&rsquo;s best matchups, injury notes, and our
        picks. No spam.
      </p>
      <form action={NEWSLETTER_ACTION} method="post" style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          style={{
            flex: 1,
            minWidth: 0,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "9px 12px",
            color: "var(--text)",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            background: "var(--blue)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
