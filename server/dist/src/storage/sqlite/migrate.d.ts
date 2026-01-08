import type { SqliteDb } from "./db.js";
export declare function applyMigrations(db: SqliteDb): Promise<void>;
