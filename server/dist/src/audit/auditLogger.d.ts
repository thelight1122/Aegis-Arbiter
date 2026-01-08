import type { SqliteDb } from "../storage/sqlite/db.js";
import type { AuditEvent } from "./auditTypes.js";
export declare class AuditLogger {
    private db;
    constructor(db: SqliteDb);
    write(event: Omit<AuditEvent, "id" | "createdAt"> & Partial<Pick<AuditEvent, "id" | "createdAt">>): Promise<AuditEvent>;
    listPublic(sessionId: string, limit?: number, sinceIso?: string): Promise<AuditEvent[]>;
}
