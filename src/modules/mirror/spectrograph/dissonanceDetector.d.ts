import type { AegisTensor } from "../../../kernal/tensor/types/tensor.js";
export interface IntegritySnapshot {
    phase_lock_gap: number;
    dissonance_markers: string[];
    confidence_variance: number;
}
/**
 * The DissonanceDetector measures the Phase-Lock Gap.
 * It fulfills the requirement for an 'Integrity Spectrograph'.
 */
export declare class DissonanceDetector {
    /**
     * Analyzes a tensor for internal structural dissonance.
     * Fulfills AXIOM_5_AWARENESS.
     */
    static analyze(tensor: AegisTensor): IntegritySnapshot;
}
