// /src/storage/sqlite/migrate.ts

import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { SqliteDb } from "./db.js";

function sha1(input: string): string {
  return crypto.createHash("sha1").update(input, "utf8").digest("hex");
}

export async function applyMigrations(db: SqliteDb): Promise<void> {
  // Ensure migrations table exists before anything else.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const schemaPath = path.join(process.cwd(), "src", "storage", "sqlite", "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  const migrationId = `schema:${sha1(schemaSql)}`;

  const existing = await db.get<{ id: string }>(
    "SELECT id FROM migrations WHERE id = ?",
    migrationId
  );

  if (existing?.id) return;

  await db.exec(schemaSql);
  await db.run(
    "INSERT INTO migrations (id, applied_at) VALUES (?, ?)",
    migrationId,
    new Date().toISOString()
  );
}
