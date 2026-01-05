// /src/storage/sqlite/db.ts
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
class NodeSqliteDb {
    db;
    constructor(filename) {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.db = new DatabaseSync(filename);
        // Pragmas for sane local behavior
        this.db.exec("PRAGMA journal_mode = WAL;");
        this.db.exec("PRAGMA foreign_keys = ON;");
    }
    async exec(sql) {
        this.db.exec(sql);
    }
    async run(sql, ...params) {
        const stmt = this.db.prepare(sql);
        stmt.run(...params);
    }
    async get(sql, ...params) {
        const stmt = this.db.prepare(sql);
        const row = stmt.get(...params);
        return row;
    }
    async all(sql, ...params) {
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows ?? [];
    }
    async close() {
        this.db.close();
    }
}
export async function openDb() {
    // Stable location for local POC db
    const dbPath = path.join(process.cwd(), "data", "aegis-local.sqlite");
    return new NodeSqliteDb(dbPath);
}
