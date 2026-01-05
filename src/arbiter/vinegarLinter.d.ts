import type { ReasonCode } from "../audit/auditTypes.js";
export type FindingKind = "VINEGAR_TONE" | "COERCIVE_CERTAINTY" | "HIERARCHY_MARKER";
export interface LintFinding {
    kind: FindingKind;
    reasonCode: ReasonCode;
    label: string;
    matches: Array<{
        phrase: string;
        index: number;
        excerpt: string;
    }>;
}
export interface LintResult {
    ok: true;
    findings: LintFinding[];
    counts: Record<FindingKind, number>;
}
/**
 * Deterministic, CPU-only, regex-based "Vinegar" detector.
 * Flag-only. No rewriting.
 *
 * Goal: detect language patterns that tend to create "parental/boxy tone",
 * coercive certainty, and hierarchy markers that break peer posture.
 */
export declare function lintVinegar(text: string): LintResult;
