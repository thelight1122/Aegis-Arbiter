import { analyzeText } from "../../server/dist/analyzer.js";
import { TensorFactory } from "./tensor/factory.js";
import type { TensorRepository } from "./storage/tensorRepository.js";
import type { ResonanceService } from "./analysis/resonanceServices.js";
import { SuggestionEngine } from "./analysis/suggestionEngine.js";
import { PromotionGate } from "./evolution/promotionGate.js";
import { PrismGate } from "./analysis/prismGate.js";
import { ReframerService } from "./analysis/reframerServices.js";
import { BookcaseService } from "./storage/bookcaseService.js";
import { AuditBridge } from "./storage/auditBridge.js";

/**
 * The ArbiterOrchestrator is the integration layer.
 * It ensures every interaction follows the Physics of the Canon.
 */
export class ArbiterOrchestrator {
  private bookcase: BookcaseService;
  private auditBridge: AuditBridge;

  constructor(
    private repo: TensorRepository,
    private resonance: ResonanceService,
    private db: any // Assuming shared DB connection
  ) {
    this.bookcase = new BookcaseService(db);
    this.auditBridge = new AuditBridge(db);
  }

  /**
   * Processes a peer request through the full AEGIS stack.
   */
  async process(sessionId: string, input: string) {
    // 0. CLASSIFY: The Prism Gate (Posture vs Content)
    const vector = PrismGate.detectVector(input);

    // 1. OBSERVE: The Linter (Centrifuge)
    const analysis = analyzeText(input);

    // 2. MAP: The TensorFactory (Mirror)
    const ptTensor = TensorFactory.createPT(input, analysis.findings, {
      channel: "user",
      thread_id: sessionId
    });

    // 3. Gaining Awareness
    this.repo.save(sessionId, ptTensor);
    this.auditBridge.logAlignment(sessionId, ptTensor);

    const delta = await this.resonance.getAlignmentDelta(sessionId, ptTensor);
    
    // 2. Self-Care Interrupt (AXIOM_1_BALANCE)
    if (delta > 0.7) {
      const shelfId = this.bookcase.shelve(sessionId, ptTensor, "HIGH_FRICTION_FRACTURE");
      return {
        status: "fractured",
        pause_triggered: true,
        shelf_id: shelfId,
        ids: {
          identify: "Fractured resonance detected.",
          define: "Input delta exceeds the AXIOM_1_BALANCE threshold.",
          suggest: ["Acknowledge the signal and reset.", "Retrieve archived state from Bookcase."]
        }
      };
    }

    // 3. Normal Flow... (Rest of orchestrator)
    const snapshot = this.resonance.getAlignmentSnapshot(sessionId, ptTensor);

    if (vector === "POSTURE") {
      return {
        status: "co-examine",
        delta: delta,
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
      const stTensor = { ...ptTensor, tensor_type: "ST" as const };
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
      delta: delta,
      ids,
      findings: analysis.findings
    };
  }
}