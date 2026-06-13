import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import "./globals.css";

const GA_ID = "G-KJT703C0T0";

export const metadata: Metadata = {
  metadataBase: new URL("https://matchuplens.com"),
  title: {
    default: "MatchupLens — Team vs Team Stats, History & Predictions",
    template: "%s | MatchupLens",
  },
  description:
    "Every game, every matchup: team stats, head-to-head history, injury reports, and win probability predictions for the FIFA World Cup 2026, NBA, NFL, MLB, NHL, UFC, and soccer.",
  openGraph: {
    title: "MatchupLens — Team vs Team Stats, History & Predictions",
    description:
      "Every game, every matchup: team stats, head-to-head history, injury reports, and win probability predictions for NBA, NFL, MLB, NHL, UFC, and World Cup 2026.",
    url: "https://matchuplens.com",
    siteName: "MatchupLens",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatchupLens — Team vs Team Stats & Predictions",
    description: "Stats, H2H history, injuries, and win probability for every game.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

// Sets theme before first paint to avoid flash.
// Light is the default; a saved visitor choice always wins.
const themeInit = `
try {
  document.documentElement.dataset.theme = localStorage.getItem("theme") || "dark";
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  );
}
