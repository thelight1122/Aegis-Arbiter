import { DatabaseSync } from "node:sqlite";
import type { SQLInputValue } from "node:sqlite";
export type SqliteDb = NodeSqliteDb;
declare class NodeSqliteDb {
    readonly db: DatabaseSync;
    constructor(filename: string);
    exec(sql: string): Promise<void>;
    run(sql: string, ...params: SQLInputValue[]): Promise<void>;
    get<T>(sql: string, ...params: SQLInputValue[]): Promise<T | undefined>;
    all<T>(sql: string, ...params: SQLInputValue[]): Promise<T[]>;
    close(): Promise<void>;
}
export declare function openDb(): Promise<SqliteDb>;
export {};
