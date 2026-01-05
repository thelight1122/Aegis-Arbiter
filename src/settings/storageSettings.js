// /src/settings/storageSettings.ts
import crypto from "crypto";
const DEFAULT_SETTINGS = {
    mode: "minimal",
    auditPublicEnabled: true,
    auditPrivateEnabled: false,
    retainDays: 7,
    storeFullTranscripts: false,
};
const SETTINGS_KEY = "storage";
export async function ensureSession(db, sessionId) {
    const id = sessionId ?? crypto.randomUUID();
    const now = new Date().toISOString();
    const existing = await db.get("SELECT id FROM sessions WHERE id = ?", id);
    if (!existing?.id) {
        await db.run("INSERT INTO sessions (id, created_at, last_seen_at, debug_unlocked) VALUES (?, ?, ?, 0)", id, now, now);
    }
    else {
        await db.run("UPDATE sessions SET last_seen_at = ? WHERE id = ?", now, id);
    }
    // Ensure settings exist
    await ensureSettings(db);
    return id;
}
export async function ensureSettings(db) {
    const existing = await db.get("SELECT setting_key FROM settings WHERE setting_key = ?", SETTINGS_KEY);
    if (!existing?.setting_key) {
        await db.run("INSERT INTO settings (setting_key, value_json, updated_at) VALUES (?, ?, ?)", SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS), new Date().toISOString());
    }
}
export async function getStorageSettings(db) {
    const row = await db.get("SELECT value_json FROM settings WHERE setting_key = ?", SETTINGS_KEY);
    if (!row?.value_json)
        return DEFAULT_SETTINGS;
    try {
        const parsed = JSON.parse(row.value_json);
        return { ...DEFAULT_SETTINGS, ...parsed };
    }
    catch {
        return DEFAULT_SETTINGS;
    }
}
export async function setStorageMode(db, mode) {
    const current = await getStorageSettings(db);
    const next = mode === "minimal"
        ? { ...current, mode, auditPublicEnabled: true, storeFullTranscripts: false, retainDays: Math.max(3, current.retainDays) }
        : mode === "standard"
            ? { ...current, mode, auditPublicEnabled: true, storeFullTranscripts: false, retainDays: Math.max(7, current.retainDays) }
            : { ...current, mode, auditPublicEnabled: true, storeFullTranscripts: current.storeFullTranscripts, retainDays: Math.max(14, current.retainDays) };
    await db.run("UPDATE settings SET value_json = ?, updated_at = ? WHERE setting_key = ?", JSON.stringify(next), new Date().toISOString(), SETTINGS_KEY);
    return next;
}
export async function setDebugUnlocked(db, sessionId, unlocked) {
    await db.run("UPDATE sessions SET debug_unlocked = ? WHERE id = ?", unlocked ? 1 : 0, sessionId);
    const current = await getStorageSettings(db);
    const next = { ...current, auditPrivateEnabled: unlocked };
    await db.run("UPDATE settings SET value_json = ?, updated_at = ? WHERE setting_key = ?", JSON.stringify(next), new Date().toISOString(), SETTINGS_KEY);
}
export async function isDebugUnlocked(db, sessionId) {
    const row = await db.get("SELECT debug_unlocked FROM sessions WHERE id = ?", sessionId);
    return !!row?.debug_unlocked;
}
