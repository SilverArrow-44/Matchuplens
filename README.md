# MatchupLens

Team-vs-team stats, head-to-head history, injuries, and win-probability predictions for every game. Built with Next.js (App Router, TypeScript) for SEO-first server rendering.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production: `npm run build && npm start`. Deploy free on [Vercel](https://vercel.com) — import the repo, zero config.

## Structure

```
app/
  page.tsx                  Home — featured game + today's games
  [sport]/page.tsx          Sport listing (/nba, /mlb, /nhl, /soccer, /nfl)
  [sport]/[slug]/page.tsx   Game detail — hero, info strip, series tracker, 6 tabs
  globals.css               Full design system (dark theme, CSS variables)
components/                 SiteHeader, Sidebar, GameCard, GameTabs, MatchupAnalysis, Footer
lib/
  types.ts                  Data contracts (mirror real sports-API shapes)
  sampleData.ts             SAMPLE DATA — 5 games across NBA/MLB/NHL/MLS
  api.ts                    Data access layer — the ONLY file to change for live data
```

## Going live with real data

Everything reads through `lib/api.ts`. Replace its function bodies with fetches to your provider (SportRadar, SportsDataIO, ESPN, balldontlie) and map responses into `lib/types.ts` shapes. Pages, components, and SEO metadata need no changes.

Suggested order:
1. `getTodaysGames()` — schedule feed
2. `getGameBySlug()` — box scores, team stats, odds
3. Injuries + H2H (scrape/feed)
4. Predictions — generate factor lists via Claude API from the fetched data

## Monetization hooks already in place

- **Affiliate CTA #1** — `components/Sidebar.tsx` (betting trends panel). Replace `href="#"` with your DraftKings/FanDuel tracked link.
- **Affiliate CTA #2** — `components/GameTabs.tsx` (below the Prediction pick box).
- Both use `rel="nofollow sponsored"` and carry 21+/1-800-GAMBLER messaging; footer has the responsible-gambling disclaimer.
- Ad slots: sidebar panels and between tabs are natural placements for Ezoic/Mediavine.

## SEO

- URL pattern: `/nba/knicks-vs-spurs-game-5-prediction-june-11-2026` (matches "team vs team prediction" searches)
- Per-game `generateMetadata` produces unique titles/descriptions
- All pages statically prerendered (`generateStaticParams`)
- `sitemap.ts`, `robots.ts`, and JSON-LD `SportsEvent` schema are in place

## Compliance notes

- You're an affiliate, not a sportsbook — no license needed, but each affiliate program has state-level rules
- IP geolocation gates the sportsbook CTA: shown only to US visitors outside restricted states (`components/AffiliateCTA.tsx`); review the restricted-state list periodically as laws change
- Keep 21+ and 1-800-GAMBLER messaging on any page with betting links
