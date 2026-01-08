import { TensorFactory } from "../tensor/factory.js";
type FindingLike = {
    type: string;
    severity?: number;
    evidence?: string;
    index?: number;
};
export type SelfAuditMetadata = {
    channel?: "user" | "assistant" | "system" | "tool" | "external";
    thread_id?: string;
    turn_id?: string;
};
export type SelfAuditResult = {
    ok: true;
    findings_count: number;
    tensor: ReturnType<typeof TensorFactory.createPT>;
};
/**
 * Runs analyzer on input and produces a Peer Tensor (PT) representing the audit state.
 */
export declare function runSelfAudit(input: string, metadata?: SelfAuditMetadata): SelfAuditResult;
export declare class SelfAuditService {
    /**
     * Evaluates proposed system output for Force or Drift.
     * Fulfills AXIOM_3_FORCE avoidance.
     */
    static verify(proposedOutput: string): {
        ok: boolean;
        findings: FindingLike[];
    };
}
export {};
