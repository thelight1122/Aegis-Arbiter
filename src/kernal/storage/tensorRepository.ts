import type { AegisTensor } from "../tensor.js";
import type { Database } from "better-sqlite3";

/**
 * TensorRepository is responsible for persisting and retrieving tensors from the database.
 *
 * @class TensorRepository
 */
export class TensorRepository {
    constructor(private db: Database) { }

    /**
     * Saves a tensor to the database.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} tensor - The tensor to be saved.
     */
    save(sessionId: string, tensor: AegisTensor): void {
        const query = this.db.prepare(
            "INSERT INTO tensors (tensor_id, session_id, tensor_type, data) VALUES (?, ?, ?, ?)"
        );
        query.run(tensor.tensor_id, sessionId, tensor.tensor_type, JSON.stringify(tensor.state));
    }

    /**
     * Retrieves the spine vector for a given session.
     *
     * @param {string} sessionId - The session ID.
     * @returns {Promise<number[] | null>} - The spine vector.
     */
    async getSpineVector(sessionId: string): Promise<number[] | null> {
        // This is a placeholder implementation.
        // In a real implementation, this would involve a more complex calculation
        // based on the history of the conversation.
        return null;
    }

    /**
     * Retrieves the most recent Spine tensors for a session.
     */
    async getSpine(sessionId: string, limit: number): Promise<AegisTensor[]> {
        const query = this.db.prepare(
            "SELECT data FROM tensors WHERE session_id = ? AND tensor_type = 'ST' ORDER BY created_at DESC LIMIT ?"
        );
        const rows = query.all(sessionId, limit) as Array<{ data: string }>;
        return rows.map((row) => JSON.parse(row.data) as AegisTensor);
    }
}
