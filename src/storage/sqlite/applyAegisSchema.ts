// /src/storage/sqlite/applyAegisSchema.ts

import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync as Database } from "node:sqlite";

export function applyAegisSchema(db: Database): void {
  const schemaPath = path.join(__dirname, "aegisSchema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(sql);
}
