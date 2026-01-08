/**
 * The FlowCalculator implements the Multiplicative Integrity Gate.
 * Aegis Flow = ( \prod R1–R7 * (\sum A…Z)^n * pi ) * CO
 */
export declare class FlowCalculator {
    /**
     * Calculates the current Flow state.
     * If any R variable is 0, Flow is 0 (Deterministic Pause).
     */
    static calculate(virtues: Record<string, number>, resonanceDelta: number): number;
}
