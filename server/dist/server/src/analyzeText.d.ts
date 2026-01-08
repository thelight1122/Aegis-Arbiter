export type FindingType = "directive_drift" | "hierarchy_inference" | "urgency_compression" | "moral_leverage" | "identity_attractor" | "certainty_inflation" | "topic_drift" | "force_language";
export type Finding = {
    type: FindingType;
    severity: 1 | 2 | 3 | 4 | 5;
    evidence: string;
    index: number;
};
export type Analysis = {
    text_length: number;
    findings: Finding[];
};
export declare function analyzeText(input: string): Analysis;
