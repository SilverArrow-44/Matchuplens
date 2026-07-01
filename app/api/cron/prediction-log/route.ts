import { snapshotSlate, reconcileFinals, isLogPersistent } from "@/lib/predictionLog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily cron (see vercel.json): snapshot today's pre-game predictions, then
// reconcile older snapshots against finals. Secured with CRON_SECRET when set
// (Vercel sends it as a Bearer token on scheduled invocations).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const snapshot = await snapshotSlate();
  const reconcile = await reconcileFinals();

  return Response.json({
    ok: true,
    persistent: isLogPersistent(),
    ...snapshot,
    ...reconcile,
  });
}
