// /src/storage/sqlite/db.ts

import path from "path";
import fs from "fs";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

export type SqliteDb = Database<sqlite3.Database, sqlite3.Statement>;

export function resolveDbPath(baseDir?: string): string {
  const root = baseDir ?? process.cwd();
  const dataDir = path.join(root, "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, "aegis-local.sqlite");
}

export async function openDb(dbPath?: string): Promise<SqliteDb> {
  const filename = dbPath ?? resolveDbPath();
  const db = await open({
    filename,
    driver: sqlite3.Database,
  });

  // Safety + concurrency defaults.
  await db.exec("PRAGMA journal_mode = WAL;");
  await db.exec("PRAGMA foreign_keys = ON;");
  await db.exec("PRAGMA busy_timeout = 3000;");

  return db;
}
