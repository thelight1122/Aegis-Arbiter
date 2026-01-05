// /src/sovereign/commands/handleSovereignCommand.ts
import { SqliteDb } from "../../storage/sqlite/db.js";
import { AuditLogger } from "../../audit/auditLogger.js";
import { Bookcase } from "../../bookcase/bookcase.js";
import { SovereignCommand } from "./parseSovereignCommand.js";
import { getStorageSettings, setStorageMode, setDebugUnlocked, isDebugUnlocked, } from "../../settings/storageSettings.js";
export async function handleSovereignCommand(args) {
    const { db, audit, bookcase, sessionId, cmd } = args;
    // Always log command execution (PUBLIC).
    await audit.write({
        sessionId,
        channel: "PUBLIC",
        eventType: "CONTROL_COMMAND",
        severity: 0,
        axiomTags: ["SOVEREIGNTY", "TRANSPARENCY", "AGENCY"],
        reasonCodes: ["CONTROL_COMMAND_EXECUTED"],
        summary: `Command executed: ${cmd.kind}`,
        details: { cmd },
    });
    switch (cmd.kind) {
        case "HELP":
            return {
                ok: true,
                message: "Commands: /aegis help | /aegis audit --limit=50 --since=ISO | /aegis bookcase list | /aegis bookcase shelve \"label\" \"content\" --unshelve=\"cond\" | /aegis bookcase unshelve <id> | /aegis storage status | /aegis storage set minimal|standard|verbose | /aegis debug unlock --confirm=YES | /aegis debug lock | /aegis export | /aegis purge --scope=session|all --confirm=YES",
            };
        case "AUDIT": {
            const events = await audit.listPublic(sessionId, cmd.limit, cmd.since);
            return {
                ok: true,
                message: `Audit (public) returned ${events.length} events.`,
                payload: { events },
            };
        }
        case "BOOKCASE_LIST": {
            const items = await bookcase.list(sessionId);
            return {
                ok: true,
                message: `Bookcase returned ${items.length} items.`,
                payload: { items },
            };
        }
        case "BOOKCASE_SHELVE": {
            const item = await bookcase.shelve(sessionId, cmd.label, cmd.content, cmd.unshelve ?? "");
            await audit.write({
                sessionId,
                channel: "PUBLIC",
                eventType: "BOOKCASE",
                severity: 0,
                axiomTags: ["SOVEREIGNTY", "TRANSPARENCY", "EQUILIBRIUM"],
                reasonCodes: ["BOOKCASE_SHELVED"],
                summary: `Bookcase shelved: ${item.label}`,
                details: {
                    itemId: item.id,
                    label: item.label,
                    unshelveCondition: item.unshelveCondition,
                },
            });
            return { ok: true, message: `Shelved: ${item.label}`, payload: { item } };
        }
        case "BOOKCASE_UNSHELVE": {
            await bookcase.unshelve(sessionId, cmd.itemId);
            await audit.write({
                sessionId,
                channel: "PUBLIC",
                eventType: "BOOKCASE",
                severity: 0,
                axiomTags: ["SOVEREIGNTY", "TRANSPARENCY", "INTEGRATION"],
                reasonCodes: ["BOOKCASE_UNSHELVED"],
                summary: `Bookcase unshelved: ${cmd.itemId}`,
                details: { itemId: cmd.itemId },
            });
            return { ok: true, message: `Unshelved item ${cmd.itemId}` };
        }
        case "STORAGE_STATUS": {
            const settings = await getStorageSettings(db);
            const debug = await isDebugUnlocked(db, sessionId);
            return {
                ok: true,
                message: "Storage status loaded.",
                payload: { settings, debugUnlocked: debug },
            };
        }
        case "STORAGE_SET": {
            const next = await setStorageMode(db, cmd.mode);
            await audit.write({
                sessionId,
                channel: "PUBLIC",
                eventType: "SETTINGS",
                severity: 1,
                axiomTags: ["SOVEREIGNTY", "TRANSPARENCY", "EQUILIBRIUM"],
                reasonCodes: ["STORAGE_SETTING_CHANGED"],
                summary: `Storage mode set: ${cmd.mode}`,
                details: { mode: cmd.mode, next },
            });
            return {
                ok: true,
                message: `Storage mode set to ${cmd.mode}.`,
                payload: { next },
            };
        }
        case "DEBUG_UNLOCK": {
            if (!cmd.confirm) {
                return {
                    ok: false,
                    message: "To unlock deep debug: /aegis debug unlock --confirm=YES",
                };
            }
            await setDebugUnlocked(db, sessionId, true);
            await audit.write({
                sessionId,
                channel: "PUBLIC",
                eventType: "SYSTEM",
                severity: 2,
                axiomTags: ["SOVEREIGNTY", "TRANSPARENCY"],
                reasonCodes: ["DEBUG_UNLOCKED"],
                summary: "Deep debug unlocked for this session.",
                details: { sessionId },
            });
            return { ok: true, message: "Deep debug unlocked for this session." };
        }
        case "DEBUG_LOCK": {
            await setDebugUnlocked(db, sessionId, false);
            await audit.write({
                sessionId,
                channel: "PUBLIC",
                eventType: "SYSTEM",
                severity: 1,
                axiomTags: ["SOVEREIGNTY", "TRANSPARENCY"],
                reasonCodes: ["DEBUG_LOCKED"],
                summary: "Deep debug locked.",
                details: { sessionId },
            });
            return { ok: true, message: "Deep debug locked." };
        }
        case "EXPORT":
            return {
                ok: true,
                message: "Export requested. (POC stub)",
                payload: { action: "EXPORT_SESSION", sessionId },
            };
        case "PURGE": {
            if (!cmd.confirm) {
                return {
                    ok: false,
                    message: "To purge: /aegis purge --scope=session|all --confirm=YES",
                };
            }
            if (cmd.scope === "session") {
                await db.run("DELETE FROM sessions WHERE id = ?", sessionId);
                return {
                    ok: true,
                    message: "Purged current session (and cascaded logs/bookcase).",
                };
            }
            await db.exec("DELETE FROM audit_public;");
            await db.exec("DELETE FROM audit_private;");
            await db.exec("DELETE FROM bookcase_items;");
            await db.exec("DELETE FROM sessions;");
            return { ok: true, message: "Purged ALL local sessions/logs/bookcase." };
        }
        default:
            return { ok: false, message: "Unknown command." };
    }
}
