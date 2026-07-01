# Data Sources & Licensing Risk

This document summarizes where MatchupLens gets its data, the associated
third-party/licensing risk, and the plan to de-risk before serious monetization.
Keep it current when data handling changes.

## What data is fetched, and from where

All live data comes from **ESPN's public "site API"** — an **unofficial, undocumented**
endpoint family under `https://site.api.espn.com/apis/site/v2/sports/...`.
Adapter: `lib/espn.ts` (single point of change).

| Data | Endpoint | Used for |
| --- | --- | --- |
| Scores, schedules, status | `.../{league}/scoreboard[?dates=YYYYMMDD]` | Home/sport/ribbon slates, game pages |
| Team records | scoreboard `competitors[].records` | Predictions, matchup copy |
| Betting lines (moneyline, spread, O/U) | scoreboard `competitions[].odds` | Prediction base, "betting context" |
| Team leaders / player stats | scoreboard `competitors[].leaders` | "Players to watch" |
| Injuries | `.../{league}/summary?event=<id>` | Injuries tab |
| Head-to-head | `.../{league}/teams/<id>/schedule` | H2H tab |
| Season status | scoreboard `season.type` | In-season flags |
| Team/player logos & headshots | `*.espncdn.com` image URLs | Badges, OG images |
| Season type | scoreboard | pill in-season ordering |

## Fallback / sample data

- `DATA_MODE=sample` (env) forces built-in sample data (`lib/sampleData.ts`) — used for
  offline/design work only.
- In live mode, if a per-sport ESPN fetch fails, that sport falls back to sample
  games for that sport (`liveGamesFor` → `GAMES`). An empty live slate is shown truthfully.

## Where ESPN / third-party names appear

- Code: `lib/espn.ts` (endpoints, `espncdn` image hosts in `next.config.ts` `remotePatterns`).
- UI: footer ("Data sourced from ESPN"), methodology page, and per-game "Source: ESPN"
  labels on the injuries tab. We **never** claim official affiliation.

## Licensing / IP risk (be honest about this)

- **Unofficial API**: ESPN's public endpoints are not a licensed feed. They can change
  or be rate-limited/blocked without notice, and terms of use are ambiguous. Treat as
  best-effort, not guaranteed.
- **Logos & team names**: team logos and marks are the property of the leagues/teams.
  We display ESPN-hosted images by URL (no re-hosting) and use names nominatively, but
  this is still a potential trademark/licensing exposure at commercial scale.
- **Odds**: sourced from ESPN's aggregated line, not a licensed odds provider. Fine for
  "informational context," not for anything a user would rely on to place a bet.
- **Injuries / stats**: factual data, lower risk, but still sourced from an unofficial feed.

### Required user-facing disclaimers (keep visible)

- "Not affiliated with ESPN, any league, or any team."
- "Data may be delayed or estimated."
- "Predictions are informational/entertainment only — not betting advice."

## TODO / backlog — de-risk before scaling monetization

- [ ] **Move to a licensed data provider** before serious ad/affiliate revenue
      (e.g., Sportradar, SportsDataIO, Stats Perform, or an official league feed).
      Swap point is `lib/api.ts` / `lib/espn.ts` — types in `lib/types.ts` already mirror
      a real provider's shape, so only the adapter changes.
- [ ] **Logos**: license marks, or replace with generic/neutral team badges to remove
      trademark exposure.
- [ ] **Odds**: if odds become a core feature, use a licensed odds API with attribution.
- [ ] **Caching/attribution**: confirm attribution requirements of whichever provider is chosen.
- [x] Persist pre-game prediction snapshots — SCAFFOLDED in `lib/predictionLog.ts`
      with a daily cron (`/api/cron/prediction-log`, `vercel.json`). Works in-memory
      by default; attach a Vercel KV store (injects `KV_REST_API_URL` /
      `KV_REST_API_TOKEN`) to make it persistent. The accuracy page uses the
      verified log once it has reconciled entries, else falls back to reconstruction.
