import { Topbar } from "@/components/Topbar";
import { GamesRibbon } from "@/components/GamesRibbon";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <GamesRibbon />
      <main className="container" style={{ padding: "32px 16px", maxWidth: 800 }}>
        {children}
      </main>
    </>
  );
}
