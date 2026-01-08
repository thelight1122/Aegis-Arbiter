import { TensorRepository } from "../storage/tensorRepository.js";
import type { AegisTensor } from "../tensor/types/tensor.js";
declare module "../storage/tensorRepository.js" {
    interface TensorRepository {
        setPinnedST(tensorId: string, pinned: boolean): Promise<void>;
        getPinnedST(sessionId: string): Promise<AegisTensor | null>;
    }
}
/**
 * The MasterVisionService defines the 'Why' of the system.
 * It fulfills the requirement for an 'Identity Signature'.
 */
export declare class MasterVisionService {
    private repo;
    constructor(repo: TensorRepository);
    /**
     * Pins a specific ST tensor as the 'Master Vision' for a session.
     * Fulfills AXIOM_6_CHOICE.
     */
    pinVision(sessionId: string, tensorId: string): Promise<void>;
    /**
     * Retrieves the current 'Identity Signature' (Master Vision).
     * Fulfills AXIOM_5_AWARENESS.
     */
    getSignature(sessionId: string): Promise<AegisTensor | null>;
}
