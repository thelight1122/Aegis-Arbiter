export interface FinancialSnapshot {
    sustainability_index: number;
    force_prediction: string;
    is_balanced: boolean;
}
/**
 * The FinancialLensService (Caesar's Logic) maps resources to Axioms.
 * It fulfills the 'Universal Lenses' requirement (Section XII.1).
 */
export declare class FinancialLensService {
    /**
     * Evaluates resource data against AXIOM_1_BALANCE.
     * Fulfills AXIOM_5_AWARENESS.
     */
    static evaluate(income: number, outgoing: number): FinancialSnapshot;
}
