// /src/arbiter/applyArbiter.ts
import { AuditLogger } from "../audit/auditLogger.js";
import { getStorageSettings } from "../settings/storageSettings.js";
import { lintVinegar } from "./vinegarLinter.js";
/**
 * Flag-only Arbiter.
 * - Runs deterministic lint
 * - Writes PUBLIC audit event if anything is flagged
 * - Does NOT rewrite text
 */
export async function applyArbiterFlagOnly(args) {
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
    if (flagged) {
        const axiomTags = [
            "TRANSPARENCY",
            "SOVEREIGNTY",
            "EQUILIBRIUM",
            "NEUTRALITY",
        ];
        // Redaction posture depends on storage mode.
        // minimal: only counts + top-level kinds
        // standard: counts + samples (short excerpts)
        // verbose: include full findings (still not storing full transcripts elsewhere)
        const details = settings.mode === "minimal"
            ? {
                counts: { vinegar, certainty, hierarchy, total },
                kinds: lint.findings.map((f) => f.kind),
                context: context ?? {},
            }
            : settings.mode === "standard"
                ? {
                    counts: { vinegar, certainty, hierarchy, total },
                    findingsSummary,
                    context: context ?? {},
                }
                : {
                    counts: { vinegar, certainty, hierarchy, total },
                    findings: lint.findings,
                    findingsSummary,
                    context: context ?? {},
                };
        const reasonCodes = Array.from(new Set(lint.findings.map((f) => f.reasonCode)));
        await audit.write({
            sessionId,
            channel: "PUBLIC",
            eventType: "ARBITER_INTERVENTION",
            severity: 1,
            axiomTags,
            reasonCodes,
            summary: `Arbiter flag-only: ${total} marker(s) detected (vinegar=${vinegar}, certainty=${certainty}, hierarchy=${hierarchy})`,
            details,
        });
    }
    return {
        flagged,
        counts: { vinegar, certainty, hierarchy, total },
        findingsSummary,
    };
}
