/**
 * Core Interfaces for the AEGIS Unified Logic Engine.
 * Defines the contract between the CoreEngine and specific Lenses.
 */

import type { AegisTensor } from "../kernal/tensor/types/tensor.js";

/**
 * Universal input for any logic evaluation.
 * Adapts to text content, mathematical tensor state, or both.
 */
export interface LogicInput {
    content?: string;             // Text content to analyze
    tensorState?: AegisTensor;    // Mathematical state to analyze
    comparisonTensorState?: AegisTensor; // Second state for relational analysis (optional)
    context: InteractionContext;  // Meta-context (who, where, when)
}

export interface InteractionContext {
    agent_id: string;
    session_id: string;
    timestamp: string;
    scope: "PERSONAL" | "SHARED" | "GLOBAL";
    mode?: "FLOW" | "STRUCTURED" | "CRITIQUE";
}

/**
 * Standard identifier for AEGIS Axioms.
 */
export type ReferenceAxiom =
    | "AXIOM_1_BALANCE"
    | "AXIOM_2_EXTREMES"
    | "AXIOM_3_FORCE"
    | "AXIOM_4_FLOW"
    | "AXIOM_5_AWARENESS"
    | "AXIOM_6_CHOICE"
    | "AXIOM_7_INTEGRITY";

/**
 * The output from a single Lens evaluation.
 */
export interface LensResult {
    lensName: string;
    status: "STABLE" | "FRICTION" | "CRITICAL";
    score: number;                // 0.0 - 1.0 (Normalized metric, 1.0 = Perfect Alignment)
    axioms_involved: ReferenceAxiom[];
    markers: string[];            // Specific evidence or reasons for the score
    suggestion?: string;          // Actionable advice to improve alignment
}

/**
 * The final, aggregated judgment from the Core Engine.
 */
export interface LogicVerdict {
    status: "FLOW" | "FLAG" | "PAUSE";
    integratedScore: number;      // 0.0 - 1.0
    results: LensResult[];        // Individual lens details
    primaryConstraint?: string;   // The single most important blocking issue (if any)
    synthesis: string;            // Human-readable summary of the evaluation
}

/**
 * Interface that all Lenses must implement.
 */
export interface ILens {
    name: string;
    evaluate(input: LogicInput): Promise<LensResult>;
}
