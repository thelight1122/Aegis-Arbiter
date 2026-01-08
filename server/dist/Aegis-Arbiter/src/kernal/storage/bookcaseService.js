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
export class BookcaseService {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Shelves a tensor for later analysis.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} tensor - The tensor to be shelved.
     * @param {ShelfReason} reason - The reason for shelving the tensor.
     * @returns {ShelfId} - The ID of the shelf where the tensor is stored.
     */
    shelve(sessionId, tensor, reason) {
        const shelfId = crypto.randomUUID();
        const query = this.db.prepare("INSERT INTO aegis_bookcase (id, session_id, tensor_id, reason, data) VALUES (?, ?, ?, ?, ?)");
        query.run(shelfId, sessionId, tensor.tensor_id, reason, JSON.stringify(tensor));
        return shelfId;
    }
    /**
     * Unshelves a tensor for analysis.
     *
     * @param {ShelfId} shelfId - The ID of the shelf where the tensor is stored.
     * @returns {AegisTensor | null} - The tensor that was stored on the shelf.
     */
    unshelve(shelfId) {
        const query = this.db.prepare("SELECT data FROM aegis_bookcase WHERE id = ?");
        const result = query.get(shelfId);
        if (!result) {
            return null;
        }
        return JSON.parse(result.data);
    }
}
//# sourceMappingURL=bookcaseService.js.map