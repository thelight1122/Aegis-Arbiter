import { TensorRepository } from "../../kernal/storage/tensorRepository.js";
export interface EvolutionTrend {
    sample_count: number;
    drift_velocity: number;
    coherence_stability: number;
    observation: string;
}
/**
 * The SovereigntyProgressService tracks evolutionary trajectory.
 * It fulfills the requirement for a 'Progress Map' (Section XII.3).
 */
export declare class SovereigntyProgressService {
    private repo;
    constructor(repo: TensorRepository);
    /**
     * Calculates the evolution trend from the Logic Spine.
     * Fulfills AXIOM_5_AWARENESS.
     */
    getEvolutionTrend(sessionId: string): Promise<EvolutionTrend | null>;
}
