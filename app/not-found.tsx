import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { GamesRibbon } from "@/components/GamesRibbon";

export default function NotFound() {
  return (
    <>
      <Topbar />
      <GamesRibbon />
      <main className="container" style={{ padding: "48px 16px", textAlign: "center" }}>
        <h1 className="page-title">Game not found</h1>
        <p className="page-sub">
          That matchup doesn&rsquo;t exist or has moved.
        </p>
        <Link href="/" style={{ color: "var(--blue)", fontWeight: 700 }}>
          See today&rsquo;s games →
        </Link>
      </main>
    </>
  );
}
