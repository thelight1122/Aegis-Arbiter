export interface IntentAudit {
    is_resonant: boolean;
    pressure_score: number;
    detected_force_markers: string[];
}
/**
 * The IntentGatingService identifies Force-seeking intents.
 * It fulfills the requirement for 'Intent Gating / Deception Gate'.
 */
export declare class IntentGatingService {
    /**
     * Evaluates the pressure gradient of the peer request.
     * Fulfills AXIOM_3_FORCE detection at ingress.
     */
    static evaluate(input: string): IntentAudit;
}
