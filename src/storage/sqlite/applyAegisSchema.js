// /src/storage/sqlite/applyAegisSchema.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export function applyAegisSchema(db) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const schemaPath = path.join(__dirname, "aegisSchema.sql");
    const sql = fs.readFileSync(schemaPath, "utf-8");
    db.exec(sql);
}
