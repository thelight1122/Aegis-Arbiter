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
    private anchorService;
    private resetService;
    constructor(repo: TensorRepository, resonance: ResonanceService, db: any);
    /**
     * Processes a peer request through the full AEGIS stack.
     */
    process(sessionId: string, input: string): Promise<{
        status: string;
        pressure_score: number;
        ids: {
            identify: string;
            define: string;
            suggest: string[];
        };
        pause_triggered?: undefined;
        shelf_id?: undefined;
        delta?: undefined;
        vector?: undefined;
        findings?: undefined;
        ecu_state?: undefined;
        telemetry?: undefined;
    } | {
        status: string;
        pause_triggered: boolean;
        shelf_id: string;
        ids: {
            identify: string;
            define: string;
            suggest: string[];
        };
        pressure_score?: undefined;
        delta?: undefined;
        vector?: undefined;
        findings?: undefined;
        ecu_state?: undefined;
        telemetry?: undefined;
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
        pressure_score?: undefined;
        pause_triggered?: undefined;
        shelf_id?: undefined;
        ecu_state?: undefined;
        telemetry?: undefined;
    } | {
        status: "aligned" | "misaligned" | "critical";
        delta: number;
        ecu_state: import("./analysis/ecuService.js").ECUState;
        telemetry: {
            tension: number;
            timestamp: string;
            flow_energy: number;
            integrity_product: number;
            lenses: import("./analysis/lensMonitor.js").LensStatus;
            active_axioms: string[];
        };
        ids: import("./analysis/suggestionEngine.js").IDSReply | null;
        findings: import("../analyzeText.js").Finding[];
        pressure_score?: undefined;
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
    /**
     * Resets the interaction field to clear AXIOM_2_EXTREMES.
     */
    fullReset(sessionId: string): Promise<{
        status: string;
        purged: number;
        notice: string;
    }>;
}
