import type { DatabaseSync as Database } from "node:sqlite";
export declare function ensureAegisSeed(db: Database, params: {
    orgId: string;
    orgName: string;
    userId: string;
    displayName?: string;
}): void;
