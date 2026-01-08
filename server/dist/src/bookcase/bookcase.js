// /src/bookcase/bookcase.ts
import crypto from "crypto";
export class Bookcase {
    db;
    constructor(db) {
        this.db = db;
    }
    async list(sessionId) {
        const rows = await this.db.all(`SELECT * FROM bookcase_items
       WHERE session_id = ? AND status != 'PURGED'
       ORDER BY created_at DESC`, sessionId);
        return rows.map((r) => ({
            id: r.id,
            sessionId: r.session_id,
            createdAt: r.created_at,
            label: r.label,
            content: r.content,
            unshelveCondition: r.unshelve_condition,
            status: r.status,
            unshelvedAt: r.unshelved_at,
        }));
    }
    async shelve(sessionId, label, content, unshelveCondition = "") {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await this.db.run(`INSERT INTO bookcase_items
       (id, session_id, created_at, label, content, unshelve_condition, status)
       VALUES (?, ?, ?, ?, ?, ?, 'SHELVED')`, id, sessionId, now, label, content, unshelveCondition);
        return {
            id,
            sessionId,
            createdAt: now,
            label,
            content,
            unshelveCondition,
            status: "SHELVED",
            unshelvedAt: null,
        };
    }
    async unshelve(sessionId, itemId) {
        const now = new Date().toISOString();
        await this.db.run(`UPDATE bookcase_items
       SET status = 'UNSHELVED', unshelved_at = ?
       WHERE id = ? AND session_id = ?`, now, itemId, sessionId);
    }
    async purgeSession(sessionId) {
        await this.db.run(`UPDATE bookcase_items SET status = 'PURGED'
       WHERE session_id = ?`, sessionId);
    }
}
//# sourceMappingURL=bookcase.js.map