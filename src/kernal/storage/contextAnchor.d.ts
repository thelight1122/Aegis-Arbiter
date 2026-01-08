import { TensorRepository } from "./tensorRepository.js";
import { AegisTensor } from "../tensor/types/tensor.js";
/**
 * The ContextAnchorService ensures the system 'Remembers' its Spine.
 * It fulfills the requirement for 'Contextual Anchors' (Section IX).
 */
export declare class ContextAnchorService {
    private repo;
    constructor(repo: TensorRepository);
    /**
     * Initializes the session context by anchoring to the Logic Spine.
     * Fulfills AXIOM_5_AWARENESS.
     */
    anchor(sessionId: string): Promise<AegisTensor[]>;
    private resolveSpine;
}
