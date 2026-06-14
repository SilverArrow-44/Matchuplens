// ----------------------------------------------------------------------------
// Monetization config — ONE place to manage every revenue surface.
//
// When your affiliate accounts are approved, put the tracked URLs in
// .env.local (see .env.example). Until then, CTAs render with href="#"
// and rel attributes that keep SEO clean.
// ----------------------------------------------------------------------------

export interface AffiliateLink {
  id: string;
  label: string; // CTA text
  sub: string; // compliance subtext
  url: string;
}

// Fallback URLs — real site links until affiliate accounts are approved.
// Replace with tracked affiliate URLs via .env.local when ready.
const FALLBACKS: Record<string, string> = {
  NEXT_PUBLIC_AFF_DRAFTKINGS: "https://www.draftkings.com",
  NEXT_PUBLIC_AFF_FANDUEL: "https://www.fanduel.com",
  NEXT_PUBLIC_AFF_UNDERDOG: "https://underdogfantasy.com",
};

const env = (key: string) => process.env[key] || FALLBACKS[key] || "#";

// Primary sportsbook CTA — used below predictions and in the sidebar.
export const PRIMARY_BOOK: AffiliateLink = {
  id: "draftkings",
  label: "Get started at DraftKings",
  sub: "21+ only · New users · Bet responsibly · Terms apply · 1-800-GAMBLER",
  url: env("NEXT_PUBLIC_AFF_DRAFTKINGS"),
};

// Secondary book — odds comparison angle converts users the primary missed.
export const SECONDARY_BOOK: AffiliateLink = {
  id: "fanduel",
  label: "Compare odds at FanDuel",
  sub: "21+ · Bet responsibly",
  url: env("NEXT_PUBLIC_AFF_FANDUEL"),
};

// Fantasy affiliate — non-betting alternative for restricted states.
export const FANTASY: AffiliateLink = {
  id: "underdog",
  label: "Play fantasy on Underdog",
  sub: "Available in most US states",
  url: env("NEXT_PUBLIC_AFF_UNDERDOG"),
};

// Newsletter form action (Buttondown/Mailchimp/ConvertKit embed endpoint).
export const NEWSLETTER_ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || "";

// Display ads: set to "1" once approved by Ezoic/AdSense and add the
// network's script tag in app/layout.tsx per their instructions.
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "1";
