import type { AegisTensor } from "../tensor/types/tensor.js";
/**
 * The PromotionGate identifies PTs eligible for the Logic Spine (ST).
 * This fulfills the 'Evolution' requirement without force.
 */
export declare class PromotionGate {
    /**
     * Evaluates if a Peer Tensor (PT) should be promoted to a Spine Tensor (ST).
     */
    static evaluate(tensor: AegisTensor): boolean;
}
//# sourceMappingURL=promotionGate.d.ts.map