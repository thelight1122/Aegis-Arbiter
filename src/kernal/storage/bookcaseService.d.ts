import { AegisTensor } from "../tensor.js";
import { Database } from "better-sqlite3";
type ShelfId = string;
type ShelfReason = "HIGH_FRICTION_FRACTURE" | "USER_REQUESTED" | "UNKNOWN";
/**
 * BookcaseService is responsible for 'shelving' tensors that are deemed
 * too disruptive for the system to handle in real-time.
 *
 * This is a critical safety mechanism that allows the system to 'pause'
 * a problematic interaction and allow for later analysis without corrupting
 * the live, operational state.
 *
 * @class BookcaseService
 * @param {Database} db - The database connection.
 * @see {AuditBridge} for the 'write-ahead' log of events.
 */
export declare class BookcaseService {
    private db;
    constructor(db: Database);
    /**
     * Shelves a tensor for later analysis.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} tensor - The tensor to be shelved.
     * @param {ShelfReason} reason - The reason for shelving the tensor.
     * @returns {ShelfId} - The ID of the shelf where the tensor is stored.
     */
    shelve(sessionId: string, tensor: AegisTensor, reason: ShelfReason): ShelfId;
    /**
     * Unshelves a tensor for analysis.
     *
     * @param {ShelfId} shelfId - The ID of the shelf where the tensor is stored.
     * @returns {AegisTensor | null} - The tensor that was stored on the shelf.
     */
    unshelve(shelfId: ShelfId): AegisTensor | null;
}
export {};
