// /src/audit/auditLogger.ts
import crypto from "crypto";
function uuid() {
    return crypto.randomUUID();
}
function asJson(value) {
    return JSON.stringify(value ?? {}, null, 0);
}
export class AuditLogger {
    db;
    constructor(db) {
        this.db = db;
    }
    async write(event) {
        const full = {
            id: event.id ?? uuid(),
            createdAt: event.createdAt ?? new Date().toISOString(),
            sessionId: event.sessionId,
            channel: event.channel,
            eventType: event.eventType,
            severity: event.severity,
            axiomTags: event.axiomTags,
            reasonCodes: event.reasonCodes,
            summary: event.summary,
            details: event.details ?? {},
        };
        const table = full.channel === "PUBLIC" ? "audit_public" : "audit_private";
        await this.db.run(`INSERT INTO ${table} (id, session_id, created_at, event_type, severity, axiom_tags, reason_codes, summary, details_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, full.id, full.sessionId, full.createdAt, full.eventType, full.severity, full.axiomTags.join(","), full.reasonCodes.join(","), full.summary, asJson(full.details));
        return full;
    }
    async listPublic(sessionId, limit = 50, sinceIso) {
        const rows = await this.db.all(`SELECT * FROM audit_public
       WHERE session_id = ?
       ${sinceIso ? "AND created_at >= ?" : ""}
       ORDER BY created_at DESC
       LIMIT ?`, ...(sinceIso ? [sessionId, sinceIso, limit] : [sessionId, limit]));
        return rows.map((r) => ({
            id: r.id,
            sessionId: r.session_id,
            createdAt: r.created_at,
            channel: "PUBLIC",
            eventType: r.event_type,
            severity: r.severity,
            axiomTags: String(r.axiom_tags || "").split(",").filter(Boolean),
            reasonCodes: String(r.reason_codes || "").split(",").filter(Boolean),
            summary: r.summary,
            details: safeParse(r.details_json),
        }));
    }
}
function safeParse(json) {
    try {
        return JSON.parse(json || "{}");
    }
    catch {
        return {};
    }
}
