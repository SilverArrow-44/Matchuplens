import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://matchuplens.com"),
  title: {
    default: "MatchupLens — Team vs Team Stats, History & Predictions",
    template: "%s | MatchupLens",
  },
  description:
    "Every game, every matchup: team stats, head-to-head history, injury reports, and win probability predictions for the FIFA World Cup 2026, NBA, NFL, MLB, NHL, UFC, and soccer.",
};

// Sets theme before first paint to avoid flash.
// Light is the default; a saved visitor choice always wins.
const themeInit = `
try {
  document.documentElement.dataset.theme = localStorage.getItem("theme") || "light";
} catch (e) { document.documentElement.dataset.theme = "light"; }
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
