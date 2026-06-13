import type { MetadataRoute } from "next";
import { getAllGameParams, getSports } from "@/lib/api";

const BASE = "https://matchuplens.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sports, games] = await Promise.all([getSports(), getAllGameParams()]);

  return [
    { url: BASE, changeFrequency: "hourly", priority: 1 },
    ...sports.map((s) => ({
      url: `${BASE}/${s.id}`,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    ...games.map((g) => ({
      url: `${BASE}/${g.sport}/${g.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
  ];
}
