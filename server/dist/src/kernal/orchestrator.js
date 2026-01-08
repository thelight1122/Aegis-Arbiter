import { analyzeText } from "../../server/dist/analyzer.js";
import { TensorFactory } from "./tensor/factory.js";
import { SuggestionEngine } from "./analysis/suggestionEngine.js";
import { PromotionGate } from "./evolution/promotionGate.js";
import { PrismGate } from "./analysis/prismGate.js";
import { ReframerService } from "./analysis/reframerServices.js";
/**
 * The ArbiterOrchestrator is the integration layer.
 * It ensures every interaction follows the Physics of the Canon.
 */
export class ArbiterOrchestrator {
    repo;
    resonance;
    constructor(repo, resonance) {
        this.repo = repo;
        this.resonance = resonance;
    }
    /**
     * Processes a peer request through the full AEGIS stack.
     */
    async process(sessionId, input) {
        // 0. CLASSIFY: The Prism Gate (Posture vs Content)
        const vector = PrismGate.detectVector(input);
        // 1. OBSERVE: The Linter (Centrifuge)
        const analysis = analyzeText(input);
        // 2. MAP: The TensorFactory (Mirror)
        const ptTensor = TensorFactory.createPT(input, analysis.findings, {
            channel: "user",
            thread_id: sessionId
        });
        // 3. GROUND: The Repository (Persistence)
        this.repo.save(sessionId, ptTensor);
        // 4. ANALYZE: ResonanceService (Alignment Delta)
        const snapshot = this.resonance.getAlignmentSnapshot(sessionId, ptTensor);
        if (vector === "POSTURE") {
            return {
                status: "co-examine",
                delta: snapshot.equilibrium_delta,
                vector,
                ids: {
                    identify: "Relational skepticism detected.",
                    define: "Input targets system posture/authority rather than a correctness vector.",
                    suggest: [
                        "Proceed with co-examination of the observed pressure.",
                        "Reset session to clear relational charge."
                    ]
                },
                findings: analysis.findings
            };
        }
        // 5. EVOLVE: PromotionGate (Potential Spine Update)
        if (PromotionGate.evaluate(ptTensor)) {
            const stTensor = { ...ptTensor, tensor_type: "ST" };
            this.repo.save(sessionId, stTensor);
        }
        // 6. REFLECT: SuggestionEngine (IDS Block)
        const ids = SuggestionEngine.generate(ptTensor, snapshot);
        if (ids) {
            const pivots = ReframerService.reframe(input, analysis.findings);
            ids.suggest.push(...pivots);
        }
        // Return the multidimensional response
        return {
            status: snapshot.resonance_status,
            delta: snapshot.equilibrium_delta,
            ids,
            findings: analysis.findings
        };
    }
}
