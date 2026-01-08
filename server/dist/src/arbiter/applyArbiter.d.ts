import { AuditLogger } from "../audit/auditLogger.js";
import type { SqliteDb } from "../storage/sqlite/db.js";
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
 * Flag-only Arbiter + AEGIS Session State Gate + Time Markers
 * - Runs deterministic lint
 * - Writes PUBLIC audit event if anything is flagged
 * - Updates aegis_sessions.integrity_resonance
 * - Sets session posture to 'paused' when Integrity Resultant drops below threshold
 * - Observes violated root markers (candidate -> learned promotion over time)
 * - Does NOT rewrite text
 */
export declare function applyArbiterFlagOnly(args: {
    db: SqliteDb;
    audit: AuditLogger;
    sessionId: string;
    text: string;
    context?: Record<string, unknown>;
}): Promise<ArbiterApplyResult>;
