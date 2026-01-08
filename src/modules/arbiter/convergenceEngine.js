import { LensMonitor } from "../../kernal/analysis/lensMonitor.js";
/**
 * The ConvergenceEngine identifies the path to Relational Equilibrium.
 * It fulfills the 'Conflict Negotiation' requirement.
 */
export class ConvergenceEngine {
    /**
     * Compares two sovereign states to identify a channel for AXIOM_4_FLOW.
     * Fulfills AXIOM_1_BALANCE.
     */
    static evaluate(tensorA, tensorB) {
        const statusA = LensMonitor.evaluate(tensorA);
        const statusB = LensMonitor.evaluate(tensorB);
        // Calculate the gap between their emotional frequencies (Friction)
        const frictionDelta = Math.abs(statusA.emotional - statusB.emotional);
        // The midpoint is the target for AXIOM_1_BALANCE
        const midpoint = (statusA.mental + statusB.mental) / 2;
        const markers = [];
        if (frictionDelta > 0.5) {
            markers.push("AXIOM_3_FORCE: Significant relational friction detected.");
        }
        if (Math.abs(statusA.mental - statusB.mental) > 0.6) {
            markers.push("AXIOM_2_EXTREMES: Polarized mental lenses detected.");
        }
        return {
            party_a_status: statusA,
            party_b_status: statusB,
            differential_friction: frictionDelta,
            equilibrium_point: midpoint,
            conflict_markers: markers
        };
    }
}
