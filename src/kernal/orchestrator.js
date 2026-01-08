import { analyzeText } from "../analyzeText.js";
import { TensorFactory } from "./tensor/factory.js";
import { SuggestionEngine } from "./analysis/suggestionEngine.js";
import { PromotionGate } from "./evolution/promotionGate.js";
import { PrismGate } from "./analysis/prismGate.js";
import { ReframerService } from "./analysis/reframerServices.js";
import { SelfAuditService } from "./analysis/selfAuditService.js";
import { BookcaseService } from "./storage/bookcaseService.js";
import { AuditBridge } from "./storage/auditBridge.js";
import { RecoveryService } from "./analysis/recoveryServices.js";
/**
 * The ArbiterOrchestrator is the integration layer.
 * It ensures every interaction follows the Physics of the Canon.
 */
export class ArbiterOrchestrator {
    repo;
    resonance;
    db;
    bookcase;
    auditBridge;
    recovery;
    constructor(repo, resonance, db // Assuming shared DB connection
    ) {
        this.repo = repo;
        this.resonance = resonance;
        this.db = db;
        this.bookcase = new BookcaseService(db);
        this.auditBridge = new AuditBridge(db);
        this.recovery = new RecoveryService(db);
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
            const stTensor = { ...ptTensor, tensor_type: "ST" };
            this.repo.save(sessionId, stTensor);
        }
        // 6. REFLECT: SuggestionEngine (IDS Block)
        const ids = SuggestionEngine.generate(ptTensor, snapshot);
        if (ids) {
            // 6. SELF-AUDIT: The Recursive Integrity Check
            const fullText = `${ids.identify} ${ids.define} ${ids.suggest.join(" ")}`;
            const selfCheck = SelfAuditService.verify(fullText);
            if (!selfCheck.ok) {
                // System detects its own drift; re-routes to Reframer
                const cleanSuggestions = ReframerService.reframe(fullText, selfCheck.findings);
                ids.suggest = [
                    ...cleanSuggestions,
                    "System note: Self-correction applied to remove force language."
                ];
            }
            else {
                const pivots = ReframerService.reframe(input, analysis.findings);
                ids.suggest.push(...pivots);
            }
        }
        // Return the multidimensional response
        return {
            status: snapshot.resonance_status,
            delta: delta,
            ids,
            findings: analysis.findings
        };
    }
    /**
     * Resumes a session by integrating a shelved fracture.
     */
    async resume(sessionId, shelfId, peerNote) {
        const integration = this.recovery.integrate(shelfId, peerNote);
        if (!integration.ok) {
            return { status: "fractured", pause_triggered: true, notice: integration.message };
        }
        // Return a 'stable' status to allow the ParameterGate to open
        return {
            status: "stable",
            notice: "Recovery complete. AXIOM_4_FLOW restored.",
            delta: 0.0 // Reset delta for the restart
        };
    }
}
