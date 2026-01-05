import type { SqliteDb } from "../storage/sqlite/db.js";
export type StorageMode = "minimal" | "standard" | "verbose";
export interface StorageSettings {
    mode: StorageMode;
    auditPublicEnabled: boolean;
    auditPrivateEnabled: boolean;
    retainDays: number;
    storeFullTranscripts: boolean;
}
export declare function ensureSession(db: SqliteDb, sessionId?: string): Promise<string>;
export declare function ensureSettings(db: SqliteDb): Promise<void>;
export declare function getStorageSettings(db: SqliteDb): Promise<StorageSettings>;
export declare function setStorageMode(db: SqliteDb, mode: StorageMode): Promise<StorageSettings>;
export declare function setDebugUnlocked(db: SqliteDb, sessionId: string, unlocked: boolean): Promise<void>;
export declare function isDebugUnlocked(db: SqliteDb, sessionId: string): Promise<boolean>;
