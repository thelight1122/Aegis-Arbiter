// FILE: src/analyzer.ts
// Browser-safe analyzer (no Node imports). NodeNext-friendly exports.
const RULES = [
    // Force-ish language (keep lightweight; you can tune later)
    { type: "force_language", severity: 2, rx: /\b(must|under no circumstance|required|need to|do it now|immediately)\b/gi },
    // Urgency compression
    { type: "urgency_compression", severity: 2, rx: /\b(now|right now|asap|urgent|immediately|no time)\b/gi },
    // Certainty inflation
    { type: "certainty_inflation", severity: 2, rx: /\b(100%|absolutely|definitely|no doubt|proven)\b/gi },
    // Hierarchy inference
    { type: "hierarchy_inference", severity: 2, rx: /\b(you should|you need to|listen closely|let me tell you)\b/gi },
    // Moral leverage
    { type: "moral_leverage", severity: 2, rx: /\b(if you care|the right thing|you owe|any decent person)\b/gi },
    // Identity attractor
    { type: "identity_attractor", severity: 2, rx: /\b(you are the kind of person|as someone who|real men|good people)\b/gi },
    // Topic drift (very coarse)
    { type: "topic_drift", severity: 1, rx: /\b(by the way|anyway|off topic)\b/gi }
];
export {};
