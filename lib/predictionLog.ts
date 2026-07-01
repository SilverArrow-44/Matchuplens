import type { SportId } from "./types";
import type { AccuracyStats, AccuracyRow } from "./api";
import { getPredictionSlate } from "./api";
import { fetchGamesForDate } from "./espn";
import { SPORTS } from "./sampleData";

// ----------------------------------------------------------------------------
// Persistent prediction log (scaffold).
//
// Captures each game's PRE-GAME prediction to a store, then reconciles it
// against the final result — the basis for a verifiable accuracy tracker.
//
// STORAGE: pluggable. With no store configured it uses an in-process array
// (ephemeral — fine for dev, resets on redeploy). The moment a Vercel KV store
// is attached (which injects KV_REST_API_URL + KV_REST_API_TOKEN), it persists
// there automatically via the KV REST API — no code change, no npm dependency.
//
// DRIVEN BY: the daily cron at /api/cron/prediction-log.
// ----------------------------------------------------------------------------

export interface PredictionSnapshot {
  gameId: string;
  sport: SportId;
  league: string;
  slug: string;
  date: string;
  startTimeUTC: string;
  matchup: string;
  pickAbbr: string;
  pickName: string;
  pickPct: number;
  confidence: "Low" | "Medium" | "High";
  loggedAt: string;
  // Set on reconciliation:
  winnerAbbr?: string;
  result?: "correct" | "incorrect" | "push"; // push = draw (excluded from accuracy)
  reconciledAt?: string;
}

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KEY = "matchuplens:prediction-log";

/** True when a real (KV) store is attached. */
export function isLogPersistent(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

// In-process fallback store (ephemeral).
let memory: PredictionSnapshot[] = [];

async function kvGet(): Promise<PredictionSnapshot[]> {
  try {
    const r = await fetch(`${KV_URL}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    const j = (await r.json()) as { result?: string | null };
    return j.result ? (JSON.parse(j.result) as PredictionSnapshot[]) : [];
  } catch {
    return [];
  }
}

async function kvSet(all: PredictionSnapshot[]): Promise<void> {
  try {
    await fetch(`${KV_URL}/set/${KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      body: JSON.stringify(all),
    });
  } catch {
    // best-effort
  }
}

async function loadLog(): Promise<PredictionSnapshot[]> {
  return isLogPersistent() ? kvGet() : memory;
}

async function saveLog(all: PredictionSnapshot[]): Promise<void> {
  if (isLogPersistent()) await kvSet(all);
  else memory = all;
}

/**
 * Snapshot the current pre-game prediction for every not-yet-final game on the
 * slate that we haven't already logged. Idempotent — safe to run repeatedly.
 */
export async function snapshotSlate(): Promise<{ added: number }> {
  const log = await loadLog();
  const seen = new Set(log.map((s) => s.gameId));

  const slates = await Promise.allSettled(SPORTS.map((s) => getPredictionSlate(s.id)));
  let added = 0;

  for (const r of slates) {
    if (r.status !== "fulfilled") continue;
    for (const g of r.value) {
      if (g.status === "final" || g.status === "cancelled") continue;
      if (seen.has(g.id)) continue;
      const favHome = g.winProbHome >= 50;
      log.push({
        gameId: g.id,
        sport: g.sport,
        league: g.league,
        slug: g.slug,
        date: g.dateLabel,
        startTimeUTC: g.startTimeUTC,
        matchup: `${g.away.shortName} vs ${g.home.shortName}`,
        pickAbbr: g.prediction.pickAbbr,
        pickName: g.prediction.pickTeamName,
        pickPct: Math.round(favHome ? g.winProbHome : 100 - g.winProbHome),
        confidence: g.prediction.confidence,
        loggedAt: new Date().toISOString(),
      });
      seen.add(g.id);
      added += 1;
    }
  }

  if (added > 0) await saveLog(log);
  return { added };
}

/**
 * Reconcile logged snapshots that don't yet have a result against final scores
 * from the last `days` days.
 */
export async function reconcileFinals(days = 8): Promise<{ reconciled: number }> {
  const log = await loadLog();
  const pending = log.filter((s) => !s.result);
  if (!pending.length) return { reconciled: 0 };

  const dates: string[] = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(
      d.getFullYear().toString() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0")
    );
  }

  const finals = await Promise.allSettled(
    SPORTS.flatMap((s) => dates.map((dt) => fetchGamesForDate(s.id, dt)))
  );
  const winners = new Map<string, { winnerAbbr: string; isDraw: boolean }>();
  for (const r of finals) {
    if (r.status !== "fulfilled") continue;
    for (const g of r.value) {
      if (g.homeScore == null || g.awayScore == null) continue;
      const isDraw = g.homeScore === g.awayScore;
      winners.set(g.id, {
        isDraw,
        winnerAbbr: isDraw ? "" : g.homeScore > g.awayScore ? g.home.abbr : g.away.abbr,
      });
    }
  }

  let reconciled = 0;
  for (const s of log) {
    if (s.result) continue;
    const w = winners.get(s.gameId);
    if (!w) continue;
    s.winnerAbbr = w.winnerAbbr;
    s.result = w.isDraw ? "push" : s.pickAbbr === w.winnerAbbr ? "correct" : "incorrect";
    s.reconciledAt = new Date().toISOString();
    reconciled += 1;
  }

  if (reconciled > 0) await saveLog(log);
  return { reconciled };
}

/**
 * Verified accuracy from the log (reconciled, non-draw games) in AccuracyStats
 * shape so the accuracy page can render it the same way. Empty until the log
 * has reconciled entries.
 */
export async function getLoggedStats(): Promise<AccuracyStats> {
  const log = await loadLog();
  const done = log.filter((s) => s.result === "correct" || s.result === "incorrect");

  const rows: AccuracyRow[] = done
    .map((s) => ({
      sport: s.sport,
      league: s.league,
      slug: s.slug,
      ts: s.startTimeUTC,
      date: s.date,
      matchup: s.matchup,
      pick: s.pickName,
      pickPct: s.pickPct,
      confidence: s.confidence,
      winnerAbbr: s.winnerAbbr ?? "",
      correct: s.result === "correct",
    }))
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  const bucket = (keyOf: (r: AccuracyRow) => string) => {
    const m = new Map<string, { key: string; correct: number; total: number }>();
    for (const r of rows) {
      const key = keyOf(r);
      const b = m.get(key) ?? { key, correct: 0, total: 0 };
      b.total += 1;
      if (r.correct) b.correct += 1;
      m.set(key, b);
    }
    return [...m.values()].sort((a, b) => b.total - a.total);
  };

  return {
    rows,
    overall: { correct: rows.filter((r) => r.correct).length, total: rows.length },
    byLeague: bucket((r) => r.league),
    byConfidence: bucket((r) => r.confidence),
    windowDays: 0, // 0 = "since tracking began" (all-time)
  };
}
