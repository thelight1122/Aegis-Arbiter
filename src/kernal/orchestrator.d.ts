import type { TensorRepository } from "./storage/tensorRepository.js";
import type { ResonanceService } from "./analysis/resonanceServices.js";
/**
 * The ArbiterOrchestrator is the integration layer.
 * It ensures every interaction follows the Physics of the Canon.
 */
export declare class ArbiterOrchestrator {
    private repo;
    private resonance;
    private db;
    private bookcase;
    private auditBridge;
    private recovery;
    constructor(repo: TensorRepository, resonance: ResonanceService, db: any);
    /**
     * Processes a peer request through the full AEGIS stack.
     */
    process(sessionId: string, input: string): Promise<{
        status: string;
        pause_triggered: boolean;
        shelf_id: string;
        ids: {
            identify: string;
            define: string;
            suggest: string[];
        };
        delta?: undefined;
        vector?: undefined;
        findings?: undefined;
    } | {
        status: string;
        delta: number;
        vector: "POSTURE";
        ids: {
            identify: string;
            define: string;
            suggest: string[];
        };
        findings: import("../analyzeText.js").Finding[];
        pause_triggered?: undefined;
        shelf_id?: undefined;
    } | {
        status: "aligned" | "misaligned" | "critical";
        delta: number;
        ids: import("./analysis/suggestionEngine.js").IDSReply | null;
        findings: import("../analyzeText.js").Finding[];
        pause_triggered?: undefined;
        shelf_id?: undefined;
        vector?: undefined;
    }>;
    /**
     * Resumes a session by integrating a shelved fracture.
     */
    resume(sessionId: string, shelfId: string, peerNote: string): Promise<{
        status: string;
        pause_triggered: boolean;
        notice: string;
        delta?: undefined;
    } | {
        status: string;
        notice: string;
        delta: number;
        pause_triggered?: undefined;
    }>;
}
