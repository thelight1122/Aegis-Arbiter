// FILE: server/src/kernal/analysis/selfAuditService.ts
// NodeNext/ESM rule: use .js extensions in relative imports
import { analyzeText } from "../../analyzeText.js";
import { TensorFactory } from "../tensor/factory.js";
/**
 * Runs analyzer on input and produces a Peer Tensor (PT) representing the audit state.
 */
export function runSelfAudit(input, metadata = {}) {
    // analyzeText shape differs across builds; we cast minimally to avoid type-lock.
    const audit = analyzeText(input);
    const findings = (audit?.findings ?? []);
    // Example derived signal (kept, but now typed to avoid TS7006)
    const hasForce = findings.some((f) => f.type === "force_language");
    // If you want to use hasForce later, it’s here. Keeping it prevents “unused” refactors later.
    void hasForce;
    const tensor = TensorFactory.createPT(input, findings, metadata);
    return {
        ok: true,
        findings_count: findings.length,
        tensor
    };
}
export class SelfAuditService {
    /**
     * Evaluates proposed system output for Force or Drift.
     * Fulfills AXIOM_3_FORCE avoidance.
     */
    static verify(proposedOutput) {
        const audit = analyzeText(proposedOutput);
        const findings = (audit?.findings ?? []);
        const hasForce = findings.some((f) => f.type === "hierarchy_inference" || f.type === "force_language");
        return {
            ok: !hasForce,
            findings
        };
    }
}
