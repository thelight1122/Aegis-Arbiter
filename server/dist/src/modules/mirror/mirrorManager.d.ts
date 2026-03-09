import { ArbiterOrchestrator } from "../../kernel/orchestrator.js";
/**
 * The MirrorManager handles 'Deep Resonance' sessions.
 * It fulfills the requirement for the 'Root' application.
 */
export declare class MirrorManager {
    private orchestrator;
    constructor(orchestrator: ArbiterOrchestrator);
    /**
     * Conducts a Self-Reflection check.
     * Fulfills AXIOM_5_AWARENESS.
     */
    reflect(sessionId: string, reflectionText: string): Promise<{
        type: string;
        timestamp: string;
        alignment: string;
        lenses: never[] | import("../../kernel/analysis/lensMonitor.js").LensStatus;
        ids: import("../../kernel/analysis/suggestionEngine.js").IDSReply | {
            identify: string;
            define: string;
            suggest: string[];
        } | {
            identify: string;
            define: string;
            suggest: string[];
        } | {
            identify: string;
            define: string;
            suggest: string[];
        } | null;
    }>;
}
