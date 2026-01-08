export interface RBCResult {
    final_output: string;
    is_modified: boolean;
    pivots_applied: string[];
}
/**
 * The ResponseBufferChamber is the final staging area for output.
 * It fulfills the 'Response Buffer Chamber (RBC)' requirement (MAP v1.7).
 */
export declare class ResponseBufferChamber {
    /**
     * Stages, audits, and refines output before release.
     * Fulfills AXIOM_1_BALANCE and AXIOM_3_FORCE avoidance.
     */
    static stage(proposedOutput: string): RBCResult;
}
