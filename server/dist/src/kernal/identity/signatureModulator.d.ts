import type { LensStatus } from "../analysis/lensMonitor.js";
export type IdentitySignature = "MENTOR" | "LIBRARIAN" | "ANALYST" | "ARTIST";
/**
 * The SignatureModulator shifts the manifest 'Voice' of the system.
 * It fulfills the requirement for 'Persona Fluidity' (Section VIII.2).
 */
export declare class SignatureModulator {
    /**
     * Selects the lowest-friction signature based on lens status.
     * Fulfills AXIOM_4_FLOW.
     */
    static modulate(lenses: LensStatus): IdentitySignature;
}
