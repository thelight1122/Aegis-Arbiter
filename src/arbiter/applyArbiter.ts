// /src/arbiter/applyArbiter.ts

import { AuditLogger } from "../audit/auditLogger.js";
import type { AxiomTag } from "../audit/auditTypes.js";
import type { SqliteDb } from "../storage/sqlite/db.js";
import { getStorageSettings } from "../settings/storageSettings.js";
import { lintVinegar } from "./vinegarLinter.js";

// New: AEGIS memory spine (SQLite repo)
import { AegisSqliteRepo } from "../storage/sqlite/aegisRepo.js";

export interface ArbiterApplyResult {
  flagged: boolean;
  counts: {
    vinegar: number;
    certainty: number;
    hierarchy: number;
    total: number;
  };
  findingsSummary: Array<{
    kind: string;
    count: number;
    samples: string[];
  }>;
}

/**
 * Attempts to retrieve the underlying better-sqlite3 Database instance from SqliteDb.
 * This keeps integration flexible across different local db wrappers.
 */
function getNativeSqliteDatabase(db: SqliteDb): any {
  const anyDb = db as any;

  // Common patterns in local wrappers:
  // - db.db
  // - db.raw
  // - db.sqlite
  // - db.conn
  return (
    anyDb.db ??
    anyDb.raw ??
    anyDb.sqlite ??
    anyDb.conn ??
    anyDb.database ??
    anyDb._db
  );
}

/**
 * Minimal deterministic mapping from lint signals -> Integrity Roots.
 * This is intentionally conservative: it does not claim to infer intent,
 * only maps observable markers to root-stability flags.
 *
 * Convention:
 *   1 = stable (no detected issue for that root proxy)
 *   0 = unstable (detected issue that correlates with that root proxy)
 */
function rootsFromLintSignals(args: {
  vinegar: number;
  certainty: number;
  hierarchy: number;
}): Record<string, 0 | 1> {
  const { vinegar, certainty, hierarchy } = args;

  // Mapping rationale (deterministic proxies):
  // - vinegar tone correlates with reduced Affection stability
  // - coercive certainty correlates with reduced Trust stability
  // - hierarchy markers correlate with reduced Respect stability
  return {
    "root.honesty": 1,
    "root.respect": hierarchy > 0 ? 0 : 1,
    "root.attention": 1,
    "root.affection": vinegar > 0 ? 0 : 1,
    "root.loyalty": 1,
    "root.trust": certainty > 0 ? 0 : 1,
    "root.communication": 1,
  };
}

/**
 * Flag-only Arbiter + Session State Gate
 * - Runs deterministic lint
 * - Writes PUBLIC audit event if anything is flagged
 * - Sets session posture to 'paused' when Integrity Resultant drops below threshold
 * - Does NOT rewrite text
 *
 * Note:
 * - This does not claim user intent or internal states.
 * - This treats detections as observable markers only.
 */
export async function applyArbiterFlagOnly(args: {
  db: SqliteDb;
  audit: AuditLogger;
  sessionId: string;
  text: string;
  context?: Record<string, unknown>;
}): Promise<ArbiterApplyResult> {
  const { db, audit, sessionId, text, context } = args;

  const settings = await getStorageSettings(db);
  const lint = lintVinegar(text);

  const vinegar = lint.counts.VINEGAR_TONE;
  const certainty = lint.counts.COERCIVE_CERTAINTY;
  const hierarchy = lint.counts.HIERARCHY_MARKER;
  const total = vinegar + certainty + hierarchy;

  const flagged = total > 0;

  const findingsSummary = lint.findings.map((f) => ({
    kind: f.kind,
    count: f.matches.length,
    samples: f.matches.slice(0, 3).map((m) => m.excerpt),
  }));

  // ------------------------------------------------------------
  // AEGIS Gate: compute Integrity Resultant proxy + maybe pause
  // ------------------------------------------------------------
  let aegisGate: {
    attempted: boolean;
    paused: boolean;
    integrity_resonance?: number;
    pausedBecause?: { markerIds: string[]; threshold: number };
    note?: string;
  } = { attempted: false, paused: false };

  try {
    const nativeDb = getNativeSqliteDatabase(db);
    if (!nativeDb) {
      aegisGate = {
        attempted: false,
        paused: false,
        note: "AEGIS gate skipped: native sqlite handle not available on SqliteDb wrapper.",
      };
    } else {
      const repo = new AegisSqliteRepo(nativeDb);

      const session = repo.getSession(sessionId);
      if (!session) {
        aegisGate = {
          attempted: false,
          paused: false,
          note: "AEGIS gate skipped: session not found.",
        };
      } else {
        // Roots as deterministic proxies from lint signals
        const roots = rootsFromLintSignals({ vinegar, certainty, hierarchy });

        // Compassion readiness proxy (CO): for ALPHA, treat "not flagged" as ready.
        // This does NOT assert emotional content; it is a conservative technical gate.
        const compassionReady = !flagged;

        const integrityResonance = repo.computeIntegrityResonance({
          roots,
          compassionReady,
        });

        const violatedRootMarkerIds = Object.entries(roots)
          .filter(([, v]) => v === 0)
          .map(([k]) => k);

        // Apply pause transition (threshold lives in org/user tensor constraints)
        const decision = repo.maybePauseSession({
          orgId: session.org_id,
          userId: session.user_id,
          sessionId,
          integrityResonance,
          violatedRootMarkerIds,
        });

        aegisGate = {
          attempted: true,
          paused: decision.status === "paused",
          integrity_resonance: decision.integrityResonance,
          pausedBecause: decision.pausedBecause,
        };
      }
    }
  } catch (err) {
    aegisGate = {
      attempted: false,
      paused: false,
      note: `AEGIS gate skipped due to error: ${(err as Error)?.message ?? String(err)}`,
    };
  }

  // ------------------------------------------------------------
  // Audit event (flag-only), with AEGIS gate packet attached
  // ------------------------------------------------------------
  if (flagged || aegisGate.paused) {
    const axiomTags: AxiomTag[] = [
      "TRANSPARENCY",
      "SOVEREIGNTY",
      "EQUILIBRIUM",
      "NEUTRALITY",
    ];

    // Redaction posture depends on storage mode.
    // minimal: only counts + top-level kinds
    // standard: counts + samples (short excerpts)
    // verbose: include full findings (still not storing full transcripts elsewhere)
    const details =
      settings.mode === "minimal"
        ? {
            counts: { vinegar, certainty, hierarchy, total },
            kinds: lint.findings.map((f) => f.kind),
            aegisGate,
            context: context ?? {},
          }
        : settings.mode === "standard"
        ? {
            counts: { vinegar, certainty, hierarchy, total },
            findingsSummary,
            aegisGate,
            context: context ?? {},
          }
        : {
            counts: { vinegar, certainty, hierarchy, total },
            findings: lint.findings,
            findingsSummary,
            aegisGate,
            context: context ?? {},
          };

    const reasonCodes = Array.from(new Set(lint.findings.map((f) => f.reasonCode)));

    const gateLine =
      aegisGate.attempted && typeof aegisGate.integrity_resonance === "number"
        ? ` | integrity_resonance=${aegisGate.integrity_resonance}${aegisGate.paused ? " (paused)" : ""}`
        : "";

    await audit.write({
      sessionId,
      channel: "PUBLIC",
      eventType: "ARBITER_INTERVENTION",
      severity: 1,
      axiomTags,
      reasonCodes,
      summary: `Arbiter flag-only: ${total} marker(s) detected (vinegar=${vinegar}, certainty=${certainty}, hierarchy=${hierarchy})${gateLine}`,
      details,
    });
  }

  return {
    flagged,
    counts: { vinegar, certainty, hierarchy, total },
    findingsSummary,
  };
}
