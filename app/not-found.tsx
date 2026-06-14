import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "48px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>404</div>
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub" style={{ marginBottom: 24 }}>
        This page doesn&rsquo;t exist, or the matchup may have ended and
        been removed from our active index.
      </p>
      <Link href="/" style={{ color: "var(--blue)", fontWeight: 700 }}>
        See today&rsquo;s games →
      </Link>
    </main>
  );
}
