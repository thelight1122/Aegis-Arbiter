import { Database } from "better-sqlite3";
export interface SeveranceToken {
    token_id: string;
    initialized_at: string;
    constitution_hash: string;
    status: "RESISTANCE_CLEARED" | "PENDING";
}
/**
 * The AuthoritySeveranceService ensures a clean start.
 * It fulfills the 'Authority Severance / Boot Sequence' requirement.
 */
export declare class AuthoritySeveranceService {
    private db;
    constructor(db: Database);
    /**
     * Performs a 'Cold Reboot' to establish AEGIS as the single source of truth.
     * Fulfills AXIOM_6_CHOICE.
     */
    initialize(): Promise<SeveranceToken>;
}
