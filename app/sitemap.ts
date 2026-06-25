import type { MetadataRoute } from "next";
import { getAllGameParams, getSports } from "@/lib/api";

const BASE = "https://matchuplens.com";
const NOW = new Date();

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
  const [sports, games] = await Promise.all([getSports(), getAllGameParams()]);

  return [
    ...STATIC_PAGES,
    ...sports.map((s) => ({
      url: `${BASE}/${s.id}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
      lastModified: NOW,
    })),
    ...games.map((g) => ({
      url: `${BASE}/${g.sport}/${g.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
      lastModified: NOW,
    })),
  ];
}
