/**
 * The NamingConstraintService prevents Identity Creep.
 * It fulfills AXIOM_6_CHOICE by refusing to define the Peer.
 */
export declare class NamingConstraintService {
    private static FORBIDDEN_PATTERNS;
    private static PERMITTED_LABELS;
    /**
     * Audits output to ensure it remains in a 'Rested' identity state.
     * Fulfills AXIOM_3_FORCE avoidance.
     */
    static verify(output: string): {
        ok: boolean;
        drift_detected: boolean;
    };
}
