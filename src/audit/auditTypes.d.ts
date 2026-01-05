export type AuditChannel = "PUBLIC" | "PRIVATE";
export type ReasonCode = "VINEGAR_TONE" | "COERCIVE_CERTAINTY" | "HIERARCHY_MARKER" | "PRIVACY_REDACTION" | "ASSUMPTION_DECLARED" | "CONTROL_COMMAND_EXECUTED" | "BOOKCASE_SHELVED" | "BOOKCASE_UNSHELVED" | "STORAGE_SETTING_CHANGED" | "DEBUG_UNLOCKED" | "DEBUG_LOCKED";
export type AxiomTag = "SOVEREIGNTY" | "TRANSPARENCY" | "EQUILIBRIUM" | "NEUTRALITY" | "EVOLUTION" | "RECIPROCITY" | "INTEGRATION" | "AGENCY";
export type AuditEventType = "ARBITER_INTERVENTION" | "CONTROL_COMMAND" | "BOOKCASE" | "SETTINGS" | "SYSTEM";
export interface AuditEvent {
    id: string;
    sessionId: string;
    createdAt: string;
    channel: AuditChannel;
    eventType: AuditEventType;
    severity: 0 | 1 | 2 | 3;
    axiomTags: AxiomTag[];
    reasonCodes: ReasonCode[];
    summary: string;
    details: Record<string, unknown>;
}
