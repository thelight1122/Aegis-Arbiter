import type { AegisTensor } from "../tensor.js";
import type { Database } from "better-sqlite3";
/**
 * AuditBridge (an informal term for a 'Peer-to-Spine' data flow) is responsible
 * for logging all significant events that cross the Corpus-Spine boundary.
 *
 * It is a write-only service that provides a clear audit trail of how the
 * system is learning and evolving.
 *
 * @class AuditBridge
 * @param {Database} db - The database connection.
 * @see {BookcaseService}
 */
export declare class AuditBridge {
    private db;
    constructor(db: Database);
    /**
     * Logs an alignment event to the audit trail.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} tensor - The tensor associated with the event.
     */
    logAlignment(sessionId: string, tensor: AegisTensor): void;
    /**
     * Logs a system event to the audit trail.
     *
     * @param {string} sessionId - The session ID.
     * @param {string} eventType - The type of event.
     * @param {Record<string, any>} details - The event details.
     */
    logSystemEvent(sessionId: string, eventType: string, details: Record<string, any>): void;
}
