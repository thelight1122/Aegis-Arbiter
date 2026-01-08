import type { AegisTensor } from "../tensor/types/tensor.js";
export interface LensStatus {
    physical: number;
    emotional: number;
    mental: number;
    spiritual: number;
    fractures: string[];
}
/**
 * The LensMonitorService evaluates the 4-Body Alignment.
 * It fulfills the requirement for a 'Multidimensional Awareness Engine'.
 */
export declare class LensMonitor {
    /**
     * Performs a Lens-Alignment Check.
     * Identifies 'Syntax Errors' in the multidimensional stack.
     */
    static evaluate(tensor: AegisTensor): LensStatus;
}
