import type { SqliteDb } from "../../storage/sqlite/db.js";
import { AuditLogger } from "../../audit/auditLogger.js";
import { Bookcase } from "../../bookcase/bookcase.js";
import type { SovereignCommand } from "./parseSovereignCommand.js";
export interface SovereignResponse {
    ok: boolean;
    message: string;
    payload?: Record<string, unknown>;
}
export declare function handleSovereignCommand(args: {
    db: SqliteDb;
    audit: AuditLogger;
    bookcase: Bookcase;
    sessionId: string;
    cmd: SovereignCommand;
}): Promise<SovereignResponse>;
