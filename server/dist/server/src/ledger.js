import { TensorRepository } from "../../src/kernal/storage/tensorRepository.js";
/**
 * The Ledger endpoint provides access to the Logic Spine.
 * It fulfills AXIOM_5_AWARENESS.
 */
export function ledgerMiddleware(repo) {
    return async (req, res) => {
        const { sessionId } = req.query;
        try {
            // Retrieve ST tensors (Stable Spine)
            const spine = await repo.getSpine(sessionId, 50);
            res.json({
                ok: true,
                session_id: sessionId,
                count: spine.length,
                tensors: spine
            });
        }
        catch (error) {
            res.status(500).json({ ok: false, error: "Ledger Retrieval Fractured" });
        }
    };
}
//# sourceMappingURL=ledger.js.map