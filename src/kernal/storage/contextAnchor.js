/**
 * The ContextAnchorService ensures the system 'Remembers' its Spine.
 * It fulfills the requirement for 'Contextual Anchors' (Section IX).
 */
export class ContextAnchorService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * Initializes the session context by anchoring to the Logic Spine.
     * Fulfills AXIOM_5_AWARENESS.
     */
    async anchor(sessionId) {
        // Pull the most recent Spine Tensors (ST) for this session.
        // These represent the 'Resolved Physics' of the project.
        const spine = await this.resolveSpine(sessionId, 5);
        if (spine.length === 0) {
            // If no spine exists, the system starts in a 'Rested' baseline.
            return [];
        }
        // AXIOM_4_FLOW: The spine provides the channel, but the moment remains sovereign.
        return spine;
    }
    async resolveSpine(sessionId, limit) {
        const spineProvider = this.repo;
        const spine = spineProvider.getSpine?.(sessionId, limit);
        if (!spine) {
            return [];
        }
        return await spine;
    }
}
