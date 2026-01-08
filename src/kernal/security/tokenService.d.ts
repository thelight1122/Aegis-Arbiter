import { AegisTensor } from "../tensor/types/tensor.js";
/**
 * The TokenService generates the 'Release Token'.
 * It fulfills the 'Sovereign-Preserving Gating' requirement.
 */
export declare class TokenService {
    private secret;
    constructor();
    /**
     * Generates a signed token if resonance is stable.
     * Fulfills AXIOM_4_FLOW.
     */
    generateRelease(tensor: AegisTensor, delta: number): string | null;
    /**
     * Verifies the token at the action boundary.
     */
    verify(token: string): boolean;
}
