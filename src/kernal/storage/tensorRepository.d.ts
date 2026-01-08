import type { AegisTensor } from "../tensor.js";
import type { Database } from "better-sqlite3";
/**
 * TensorRepository is responsible for persisting and retrieving tensors from the database.
 *
 * @class TensorRepository
 */
export declare class TensorRepository {
    private db;
    constructor(db: Database);
    /**
     * Saves a tensor to the database.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} tensor - The tensor to be saved.
     */
    save(sessionId: string, tensor: AegisTensor): void;
    /**
     * Retrieves the spine vector for a given session.
     *
     * @param {string} sessionId - The session ID.
     * @returns {Promise<number[] | null>} - The spine vector.
     */
    getSpineVector(sessionId: string): Promise<number[] | null>;
    /**
     * Retrieves the most recent Spine tensors for a session.
     */
    getSpine(sessionId: string, limit: number): Promise<AegisTensor[]>;
}
