// /src/localAegisBootstrap.ts

import { openDb } from "./storage/sqlite/db.js";
import { applyMigrations } from "./storage/sqlite/migrate.js";
import { ensureSession } from "./settings/storageSettings.js";
import { AuditLogger } from "./audit/auditLogger.js";
import { Bookcase } from "./bookcase/bookcase.js";
import { parseSovereignCommand } from "./sovereign/commands/parseSovereignCommand.js";
import { handleSovereignCommand } from "./sovereign/commands/handleSovereignCommand.js";

// AEGIS local memory (SQLite) bootstrap
import { applyAegisSchema } from "./storage/sqlite/applyAegisSchema.js";
import { ensureAegisSeed } from "./storage/sqlite/aegisSeed.js";
import { AegisSqliteRepo } from "./storage/sqlite/aegisRepo.js";

/**
 * Attempts to retrieve the underlying better-sqlite3 Database instance from SqliteDb.
 * This keeps integration flexible across different local db wrappers.
 */
function getNativeSqliteDatabase(db: unknown): any {
  const anyDb = db as any;
  return (
    anyDb.db ??
    anyDb.raw ??
    anyDb.sqlite ??
    anyDb.conn ??
    anyDb.database ??
    anyDb._db
  );
}

/**
 * POC entry function:
 * - ensures DB + schema
 * - ensures session
 * - routes /aegis commands
 *
 * Wires into your chat loop and Ghost-Layer UI.
 */
export async function localAegisBootstrap() {
  const db = await openDb();
  await applyMigrations(db);

  // Ensure local AEGIS schema + seeds exist (SQLite-only ALPHA)
  const nativeDb = getNativeSqliteDatabase(db);
  if (!nativeDb) {
    throw new Error(
      "AEGIS bootstrap could not access native sqlite database handle from SqliteDb wrapper."
    );
  }

  applyAegisSchema(nativeDb);

  // Create your existing session (your settings layer owns this)
  const sessionId = await ensureSession(db);

  // Seed local org/user/tensors/roots if missing, then mirror session into aegis_sessions
  // These IDs are local-only ALPHA defaults (demo-ready). Adjust later when auth/org creation exists.
  const orgId = "local-org";
  const userId = "local-user";

  ensureAegisSeed(nativeDb, {
    orgId,
    orgName: "AEGIS Local ALPHA",
    userId,
    displayName: "Local Operator",
  });

  const aegisRepo = new AegisSqliteRepo(nativeDb);
  aegisRepo.ensureSessionRow({
    sessionId,
    orgId,
    userId,
  });

  const audit = new AuditLogger(db);
  const bookcase = new Bookcase(db);

  return async function handleUserInput(input: string) {
    const cmd = parseSovereignCommand(input);
    if (!cmd) {
      return {
        ok: true,
        message: "Not a sovereign command. Pass to LLM pipeline.",
      };
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
