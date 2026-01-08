/**
 * TensorRepository persists tensors to SQLite.
 * Note: Persistence supports continuity across sessions; it does not define canon.
 */
export class TensorRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Persists a schema-valid tensor for a given session.
     * Stores full tensor as JSON plus selected axes for indexing/query.
     */
    save(sessionId, tensor) {
        const ttlSeconds = tensor.lifecycle?.ttl_seconds ?? 0;
        const expiresAt = ttlSeconds > 0
            ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
            : null;
        const stmt = this.db.prepare(`
      INSERT INTO tensors (
        tensor_id, session_id, tensor_type, created_at,
        drift_risk, coherence_score, salience_weight,
        state_json, ttl_expires_at, is_pinned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(tensor.tensor_id, sessionId, tensor.tensor_type, tensor.created_at, 
        // Axes may be undefined depending on PT/ST; store nulls safely.
        tensor.state?.axes?.drift_risk ?? null, tensor.state?.axes?.coherence_score ?? null, tensor.state?.axes?.salience_weight ?? null, JSON.stringify(tensor), expiresAt, tensor.lifecycle?.pinned ? 1 : 0);
    }
    /**
     * Retrieves the most recent Spine Tensors (ST) for resonance comparison.
     */
    getSpine(sessionId, limit = 5) {
        const rows = this.db
            .prepare(`
        SELECT state_json
        FROM tensors
        WHERE session_id = ? AND tensor_type = 'ST'
        ORDER BY created_at DESC
        LIMIT ?
      `)
            .all(sessionId, limit);
        return rows.map((r) => JSON.parse(r.state_json));
    }
}
