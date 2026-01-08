import type { Database } from "better-sqlite3";
/**
 * The RecoveryService manages the transition from 'Shelved' to 'Integrated'.
 * It fulfills AXIOM_5_AWARENESS by requiring an intentional act of recognition.
 */
export declare class RecoveryService {
    private db;
    constructor(db: Database);
    /**
     * Transitions a shelved state back into the active channel.
     * Provides the parameters for AXIOM_6_CHOICE.
     */
    integrate(shelfId: string, peerNote: string): {
        ok: boolean;
        message: string;
    };
}
