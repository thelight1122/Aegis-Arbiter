import { analyzeText } from "../../analyzeText.js";
/**
 * The ReviewService governs external content submissions.
 * It fulfills the requirement for 'Codex Submission Review'.
 */
export class ReviewService {
    /**
     * Evaluates a submission against the LOCKED Canon (AXIOM_1-6).
     * Fulfills AXIOM_5_AWARENESS.
     */
    static evaluateSubmission(content) {
        const audit = analyzeText(content);
        const violations = audit.findings
            .filter((f) => f.type === "force_language" || f.type === "hierarchy_inference")
            .map((f) => f.evidence);
        const isAligned = violations.length === 0;
        const ids = {
            identify: isAligned ? "Content aligns with the LOCKED Canon." : "Canonical Drift detected in submission.",
            define: isAligned
                ? "No violations of AXIOM_1-6 identified."
                : `Structural tension identified: ${violations.join("; ")}.`,
            suggest: isAligned
                ? ["Proceed with publication to the HyperVerse."]
                : [
                    "Refactor text to remove non-canonical axiom references.",
                    "Reframe using Sovereign language to reduce AXIOM_3_FORCE markers.",
                ],
        };
        return {
            is_aligned: isAligned,
            canonical_violations: violations,
            ids: ids,
        };
    }
}
//# sourceMappingURL=reviewService.js.map