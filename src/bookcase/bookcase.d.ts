import type { SqliteDb } from "../storage/sqlite/db.js";
export interface BookcaseItem {
    id: string;
    sessionId: string;
    createdAt: string;
    label: string;
    content: string;
    unshelveCondition: string;
    status: "SHELVED" | "UNSHELVED" | "PURGED";
    unshelvedAt?: string | null;
}
export declare class Bookcase {
    private db;
    constructor(db: SqliteDb);
    list(sessionId: string): Promise<BookcaseItem[]>;
    shelve(sessionId: string, label: string, content: string, unshelveCondition?: string): Promise<BookcaseItem>;
    unshelve(sessionId: string, itemId: string): Promise<void>;
    purgeSession(sessionId: string): Promise<void>;
}
