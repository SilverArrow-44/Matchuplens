import { getTodaysGames, getSports } from "@/lib/api";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader() {
  const [sports, games] = await Promise.all([getSports(), getTodaysGames()]);
  return <SiteHeaderClient sports={sports} games={games} />;
}
