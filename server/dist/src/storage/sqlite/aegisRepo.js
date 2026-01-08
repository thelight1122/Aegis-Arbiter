// /src/storage/sqlite/aegisRepo.ts
import crypto from "node:crypto";
function uuid() {
    return crypto.randomUUID();
}
function nowIso() {
    return new Date().toISOString();
}
function parseJson(s, fallback) {
    try {
        return JSON.parse(s);
    }
    catch {
        return fallback;
    }
}
export class AegisSqliteRepo {
    db;
    constructor(db) {
        this.db = db;
    }
    ensureSessionRow(params) {
        const existing = this.db
            .prepare(`SELECT id FROM aegis_sessions WHERE id = ?`)
            .get(params.sessionId);
        if (existing)
            return;
        this.db.prepare(`INSERT INTO aegis_sessions (id, org_id, user_id, status, integrity_resonance, peer_state)
       VALUES (?, ?, ?, 'active', 1.0, '{}')`).run(params.sessionId, params.orgId, params.userId);
    }
    getSession(sessionId) {
        const row = this.db
            .prepare(`SELECT id, status, integrity_resonance, peer_state, org_id, user_id FROM aegis_sessions WHERE id = ?`)
            .get(sessionId);
        return row ?? null;
    }
    setSessionStatus(sessionId, status) {
        const ended_at = status === "closed" ? nowIso() : null;
        this.db
            .prepare(`UPDATE aegis_sessions SET status = ?, ended_at = COALESCE(?, ended_at) WHERE id = ?`)
            .run(status, ended_at, sessionId);
    }
    setIntegrityResonance(sessionId, resonance) {
        this.db
            .prepare(`UPDATE aegis_sessions SET integrity_resonance = ? WHERE id = ?`)
            .run(resonance, sessionId);
    }
    getPromotionConfig(orgId, userId) {
        const org = this.getTemporalConstraints("org", orgId);
        const user = userId ? this.getTemporalConstraints("user", userId) : null;
        const orgC = org ?? {};
        const userC = user ?? {};
        const spacingMinutes = userC?.integrity?.spacing?.minutes ??
            orgC?.integrity?.spacing?.minutes ??
            30;
        const minTotal = userC?.integrity?.promotion?.minTotal ??
            orgC?.integrity?.promotion?.minTotal ??
            3;
        const minSpaced = userC?.integrity?.promotion?.minSpaced ??
            orgC?.integrity?.promotion?.minSpaced ??
            2;
        return { spacingMinutes, minTotal, minSpaced };
    }
    getPauseThreshold(orgId, userId) {
        const org = this.getTemporalConstraints("org", orgId);
        const user = userId ? this.getTemporalConstraints("user", userId) : null;
        return (user?.integrity?.thresholds?.pause ??
            org?.integrity?.thresholds?.pause ??
            0.999);
    }
    getTemporalConstraints(scopeType, scopeId) {
        const row = this.db
            .prepare(`SELECT constraints FROM aegis_temporal_tensors WHERE scope_type = ? AND scope_id = ?`)
            .get(scopeType, scopeId);
        if (!row)
            return null;
        return parseJson(row.constraints, {});
    }
    computeIntegrityResonance(params) {
        const product = Object.values(params.roots).reduce((acc, v) => acc * v, 1);
        const co = params.compassionReady ? 1 : 0;
        return product * co; // ALPHA: discrete. Later can become graded.
    }
    maybePauseSession(params) {
        const threshold = this.getPauseThreshold(params.orgId, params.userId);
        this.setIntegrityResonance(params.sessionId, params.integrityResonance);
        const session = this.getSession(params.sessionId);
        const currentStatus = (session?.status ?? "active");
        if (params.integrityResonance < threshold && currentStatus !== "paused") {
            this.setSessionStatus(params.sessionId, "paused");
            return {
                sessionId: params.sessionId,
                status: "paused",
                integrityResonance: params.integrityResonance,
                pausedBecause: { markerIds: params.violatedRootMarkerIds, threshold },
            };
        }
        return { sessionId: params.sessionId, status: currentStatus, integrityResonance: params.integrityResonance };
    }
}
//# sourceMappingURL=aegisRepo.js.map