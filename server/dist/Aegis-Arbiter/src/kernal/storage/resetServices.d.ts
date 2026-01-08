import type { Database } from "better-sqlite3";
/**
 * The ResetService manages the system's return to a 'Rested' state.
 * It fulfills the 'Axiomatic Reset' requirement (Section XIII).
 */
export declare class ResetService {
    private db;
    constructor(db: Database);
    /**
     * Purges volatile Peer Tensors while preserving the Logic Spine.
     * Fulfills AXIOM_1_BALANCE.
     */
    reset(sessionId: string): Promise<{
        ok: boolean;
        purged_count: number;
    }>;
}
