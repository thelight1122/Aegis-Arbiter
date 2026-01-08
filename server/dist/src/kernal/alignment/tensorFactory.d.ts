import type { AegisTensor, TensorType } from "../tensor/types/tensor.js";
type Finding = {
    severity?: number;
    axiom_tag?: string;
    type?: string;
};
export declare class TensorFactory {
    /**
     * Deterministic tensor generation from raw input + findings.
     * NOTE: This is a factory, not an interpreter. Keep it boring and reliable.
     */
    static generate(input: string, findings: Finding[], type?: TensorType): AegisTensor;
}
export {};
