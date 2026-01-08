import type { AegisTensor } from "../tensor/types/tensor.js";
import type { AlignmentSnapshot } from "./resonanceServices.js";
export interface IDSReply {
    identify: string;
    define: string;
    suggest: string[];
}
export declare class SuggestionEngine {
    /**
     * Generates an IDS response block based on resonance analysis.
     * This is option-framed and canon-bound (AXIOM_1..AXIOM_6 only).
     */
    static generate(current: AegisTensor, snapshot: AlignmentSnapshot): IDSReply | null;
}
//# sourceMappingURL=suggestionEngine.d.ts.map