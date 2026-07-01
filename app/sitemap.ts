import type { MetadataRoute } from "next";
import { getAllGameParams, getSports, getTeams } from "@/lib/api";
import type { SportId } from "@/lib/types";

const BASE = "https://matchuplens.com";
const NOW = new Date();

// Leagues with team hub pages (individual sports don't).
const TEAM_SPORTS: SportId[] = ["nba", "wnba", "nfl", "mlb", "nhl", "ncaaf", "ncaab", "soccer"];

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "hourly", priority: 1, lastModified: NOW },
  {
    url: `${BASE}/about`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date("2026-06-20"),
  },
  {
    url: `${BASE}/faq`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date("2026-06-20"),
  },
  {
    url: `${BASE}/glossary`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date("2026-06-20"),
  },
  {
    url: `${BASE}/guides`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date("2026-06-25"),
  },
  {
    url: `${BASE}/guides/how-to-read-win-probability`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date("2026-06-25"),
  },
  {
    url: `${BASE}/guides/sports-betting-odds-explained`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date("2026-06-25"),
  },
  {
    url: `${BASE}/guides/world-cup-2026`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date("2026-06-20"),
  },
  {
    url: `${BASE}/methodology`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date("2026-06-01"),
  },
  {
    url: `${BASE}/prediction-accuracy`,
    changeFrequency: "daily",
    priority: 0.7,
    lastModified: NOW,
  },
  {
    url: `${BASE}/legal/privacy`,
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: new Date("2026-01-01"),
  },
  {
    url: `${BASE}/legal/terms`,
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: new Date("2026-01-01"),
  },
  {
    url: `${BASE}/legal/disclaimer`,
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: new Date("2026-01-01"),
  },
  {
    url: `${BASE}/legal/affiliate-disclosure`,
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: new Date("2026-01-01"),
  },
  {
    url: `${BASE}/legal/responsible-gambling`,
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: new Date("2026-01-01"),
  },
  {
    url: `${BASE}/legal/contact`,
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: new Date("2026-01-01"),
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sports, games, teamLists] = await Promise.all([
    getSports(),
    getAllGameParams(),
    Promise.all(TEAM_SPORTS.map((s) => getTeams(s))),
  ]);

  const teamUrls = TEAM_SPORTS.flatMap((s, i) =>
    teamLists[i].map((t) => ({
      url: `${BASE}/${s}/team/${t.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
      lastModified: NOW,
    }))
  );

  return [
    ...STATIC_PAGES,
    ...sports.map((s) => ({
      url: `${BASE}/${s.id}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
      lastModified: NOW,
    })),
    // Daily prediction hubs — weekly sports use "this-week", others "today".
    ...sports.map((s) => ({
      url: `${BASE}/${s.id}/predictions/${s.id === "nfl" || s.id === "ncaaf" ? "this-week" : "today"}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
      lastModified: NOW,
    })),
    ...teamUrls,
    ...games.map((g) => ({
      url: `${BASE}/${g.sport}/${g.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
      lastModified: NOW,
    })),
  ];
}
