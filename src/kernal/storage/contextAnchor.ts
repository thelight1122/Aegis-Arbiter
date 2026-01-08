import { TensorRepository } from "./tensorRepository.js";
import { AegisTensor } from "../tensor/types/tensor.js";

/**
 * The ContextAnchorService ensures the system 'Remembers' its Spine.
 * It fulfills the requirement for 'Contextual Anchors' (Section IX).
 */
export class ContextAnchorService {
  constructor(private repo: TensorRepository) {}

  /**
   * Initializes the session context by anchoring to the Logic Spine.
   * Fulfills AXIOM_5_AWARENESS.
   */
  async anchor(sessionId: string): Promise<AegisTensor[]> {
    // Pull the most recent Spine Tensors (ST) for this session.
    // These represent the 'Resolved Physics' of the project.
    const spine = this.resolveSpine(sessionId, 5);

    if (spine.length === 0) {
      // If no spine exists, the system starts in a 'Rested' baseline.
      return [];
    }

    // AXIOM_4_FLOW: The spine provides the channel, but the moment remains sovereign.
    return spine;
  }

  private resolveSpine(sessionId: string, limit: number): AegisTensor[] {
    const spineProvider = this.repo as TensorRepository & {
      getSpine?: (sessionId: string, limit: number) => AegisTensor[];
    };

    return spineProvider.getSpine?.(sessionId, limit) ?? [];
  }
}