export type SelfAuditMetadata = {
    channel?: "user" | "assistant" | "system" | "tool" | "external";
    thread_id?: string;
    turn_id?: string;
};
export declare function runSelfAudit(input: string, metadata?: SelfAuditMetadata): {
    readonly ok: true;
    readonly findings_count: number;
    readonly tensor: import("../../../../src/kernal/tensor.js").AegisTensor;
};
