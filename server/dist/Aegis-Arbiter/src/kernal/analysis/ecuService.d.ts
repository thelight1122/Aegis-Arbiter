import type { LensStatus } from "./lensMonitor.js";
export interface ECUState {
    tension_level: number;
    is_paused: boolean;
    applied_weights: string[];
    status: "STABILIZING" | "RESTED";
}
/**
 * The ECUService implements the Empathy-Compassion-Understanding loop.
 * It fulfills the 'Integration over Suppression' requirement.
 */
export declare class ECUService {
    /**
     * Evaluates and integrates system tension.
     * Fulfills AXIOM_1_BALANCE.
     */
    static stabilize(lenses: LensStatus): ECUState;
}
