import { getVectorDb } from "../storage/vectorDb";
/**
 * ResonanceService is responsible for analyzing the 'distance' between a new
 * peer tensor and the existing spine.
 *
 * This is a critical part of the system's ability to 'feel' the conversation
 * and detect when the user is pushing against the established frame.
 *
 * @class ResonanceService
 */
export class ResonanceService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * Calculates the alignment delta between the new tensor and the existing spine.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} ptTensor - The new peer tensor.
     * @returns {Promise<number>} - The alignment delta.
     */
    async getAlignmentDelta(sessionId, ptTensor) {
        const vectorDb = await getVectorDb();
        const spineVector = await this.repo.getSpineVector(sessionId);
        if (!spineVector) {
            return 0;
        }
        const peerVector = await vectorDb.createVector(ptTensor.state.payload.text);
        return await vectorDb.compareVectors(spineVector, peerVector);
    }
    /**
     * Provides a snapshot of the current alignment state.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} ptTensor - The new peer tensor.
     * @returns {AlignmentSnapshot} - The alignment snapshot.
     */
    getAlignmentSnapshot(sessionId, ptTensor) {
        // This is a placeholder implementation.
        // In a real implementation, this would involve a more complex calculation
        // based on the history of the conversation.
        const delta = Math.random();
        return {
            resonance_status: delta > 0.7 ? "critical" : delta > 0.3 ? "misaligned" : "aligned",
            equilibrium_delta: delta,
        };
    }
}
