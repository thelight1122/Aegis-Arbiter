import { LensStatus } from "./lensMonitor.js";
/**
 * The TelemetryService provides the 'Internal Monologue' for the Glass Gate.
 * It fulfills AXIOM_5_AWARENESS.
 */
export interface AlignmentTelemetry {
    timestamp: string;
    flow_energy: number;
    integrity_product: number;
    lenses: LensStatus;
    active_axioms: string[];
}
export declare class TelemetryService {
    /**
     * Compiles the multidimensional state into a witnessable event.
     */
    static compile(flow: number, lenses: LensStatus, axiomTags: string[]): AlignmentTelemetry;
}
