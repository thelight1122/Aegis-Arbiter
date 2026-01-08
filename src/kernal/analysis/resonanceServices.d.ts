import { AegisTensor } from "../tensor";
import { TensorRepository } from "../storage/tensorRepository";
export interface AlignmentSnapshot {
    resonance_status: "aligned" | "misaligned" | "critical";
    equilibrium_delta: number;
}
/**
 * ResonanceService is responsible for analyzing the 'distance' between a new
 * peer tensor and the existing spine.
 *
 * This is a critical part of the system's ability to 'feel' the conversation
 * and detect when the user is pushing against the established frame.
 *
 * @class ResonanceService
 */
export declare class ResonanceService {
    private repo;
    constructor(repo: TensorRepository);
    /**
     * Calculates the alignment delta between the new tensor and the existing spine.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} ptTensor - The new peer tensor.
     * @returns {Promise<number>} - The alignment delta.
     */
    getAlignmentDelta(sessionId: string, ptTensor: AegisTensor): Promise<number>;
    /**
     * Provides a snapshot of the current alignment state.
     *
     * @param {string} sessionId - The session ID.
     * @param {AegisTensor} ptTensor - The new peer tensor.
     * @returns {AlignmentSnapshot} - The alignment snapshot.
     */
    getAlignmentSnapshot(sessionId: string, ptTensor: AegisTensor): AlignmentSnapshot;
}
