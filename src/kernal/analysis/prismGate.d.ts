export type InteractionVector = "CORRECTNESS" | "POSTURE";
/**
 * The PrismGate classifies the 'Vector' of the incoming signal.
 * It prevents AXIOM_3_FORCE by identifying relational pressure early.
 */
export declare class PrismGate {
    private static POSTURE_MARKERS;
    /**
     * Evaluates the input text to determine the interaction mode.
     */
    static detectVector(input: string): InteractionVector;
}
//# sourceMappingURL=prismGate.d.ts.map