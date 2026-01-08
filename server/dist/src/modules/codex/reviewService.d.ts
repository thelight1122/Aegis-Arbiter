import type { IDSReply } from "../../kernal/analysis/suggestionEngine.js";
export interface ReviewResult {
    is_aligned: boolean;
    canonical_violations: string[];
    ids: IDSReply;
}
/**
 * The ReviewService governs external content submissions.
 * It fulfills the requirement for 'Codex Submission Review'.
 */
export declare class ReviewService {
    /**
     * Evaluates a submission against the LOCKED Canon (AXIOM_1-6).
     * Fulfills AXIOM_5_AWARENESS.
     */
    static evaluateSubmission(content: string): ReviewResult;
}
