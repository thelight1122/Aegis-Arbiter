import { TokenService } from "./tokenService.js";
/**
 * The ParameterGate defines the operating parameters for execution.
 * It ensures that the channel for AXIOM_4_FLOW is clearly calibrated.
 */
export declare class ParameterGate {
    private tokenService;
    constructor(tokenService: TokenService);
    /**
     * Evaluates if the current state aligns with operating parameters.
     * Provides data for AXIOM_6_CHOICE.
     */
    process<T>(token: string | null, operation: () => Promise<T>): Promise<T | {
        status: string;
        resonance_required: boolean;
    }>;
}
