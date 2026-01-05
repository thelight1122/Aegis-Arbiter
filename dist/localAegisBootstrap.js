// /src/localAegisBootstrap.ts
import { openDb } from "./storage/sqlite/db.js";
import { applyMigrations } from "./storage/sqlite/migrate.js";
import { ensureSession } from "./settings/storageSettings.js";
import { AuditLogger } from "./audit/auditLogger.js";
import { Bookcase } from "./bookcase/bookcase.js";
import { parseSovereignCommand } from "./sovereign/commands/parseSovereignCommand.js";
import { handleSovereignCommand } from "./sovereign/commands/handleSovereignCommand.js";
/**
 * POC entry function:
 * - ensures DB + schema
 * - ensures session
 * - routes /aegis commands
 *
 * You will wire this into your chat loop and Ghost-Layer UI.
 */
export async function localAegisBootstrap() {
    const db = await openDb();
    await applyMigrations(db);
    const sessionId = await ensureSession(db);
    const audit = new AuditLogger(db);
    const bookcase = new Bookcase(db);
    return async function handleUserInput(input) {
        const cmd = parseSovereignCommand(input);
        if (!cmd) {
            return { ok: true, message: "Not a sovereign command. Pass to LLM pipeline." };
        }
        return await handleSovereignCommand({
            db,
            audit,
            bookcase,
            sessionId,
            cmd,
        });
    };
}
