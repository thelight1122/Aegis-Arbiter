import type { AegisTensor } from "../../kernal/tensor/types/tensor.js";
import { type LensStatus } from "../../kernal/analysis/lensMonitor.js";
export interface ConvergenceSnapshot {
    party_a_status: LensStatus;
    party_b_status: LensStatus;
    differential_friction: number;
    equilibrium_point: number;
    conflict_markers: string[];
}
/**
 * The ConvergenceEngine identifies the path to Relational Equilibrium.
 * It fulfills the 'Conflict Negotiation' requirement.
 */
export declare class ConvergenceEngine {
    /**
     * Compares two sovereign states to identify a channel for AXIOM_4_FLOW.
     * Fulfills AXIOM_1_BALANCE.
     */
    static evaluate(tensorA: AegisTensor, tensorB: AegisTensor): ConvergenceSnapshot;
}
