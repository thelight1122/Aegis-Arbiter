// FILE: server/src/kernal/analysis/selfAuditService.ts
import { analyzeText } from "../../analyzeText.js";
import { TensorFactory } from "../../../../src/kernal/tensor/factory.js";
export function runSelfAudit(input, metadata = {}) {
    const audit = analyzeText(input);
    const findings = (audit?.findings ?? []);
    const tensor = TensorFactory.createPT(input, findings, metadata);
    return {
        ok: true,
        findings_count: findings.length,
        tensor
    };
}
//# sourceMappingURL=selfAuditService.js.map