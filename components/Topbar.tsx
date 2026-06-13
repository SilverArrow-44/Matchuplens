import Link from "next/link";
import { getSports } from "@/lib/api";
import { ThemeToggle } from "./ThemeToggle";

export async function Topbar({ activeSport }: { activeSport?: string }) {
  const sports = await getSports();
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link href="/" className="logo">
          Matchup<span>Lens</span>
        </Link>
        <nav className="sport-nav">
          {sports.map((s) => (
            <Link
              key={s.id}
              href={`/${s.id}`}
              className={`sport-link${activeSport === s.id ? " active" : ""}`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
