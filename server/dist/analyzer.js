// server/src/analyzer.ts
// AEGIS Analyzer (in-process) — heuristic detection for RBC / Arbiter / Lint
const FINDING_TYPES = [
    "directive_drift",
    "hierarchy_inference",
    "urgency_compression",
    "moral_leverage",
    "identity_attractor",
    "certainty_inflation",
    "topic_drift",
    "force_language",
    "ultimatum",
];
function emptyCounts() {
    const out = {};
    for (const t of FINDING_TYPES)
        out[t] = 0;
    return out;
}
function addFinding(findings, counts, type, severity, evidence, index) {
    findings.push({ type, severity, evidence, index });
    counts[type] += 1;
}
function findAll(text, re) {
    const out = [];
    const rr = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    let m;
    while ((m = rr.exec(text)) !== null) {
        out.push({ index: m.index, match: m[0] });
        // prevent infinite loops on zero-length matches
        if (m.index === rr.lastIndex)
            rr.lastIndex++;
    }
    return out;
}
export function analyzeText(text, flags) {
    const t = (text ?? "").toString();
    const lower = t.toLowerCase();
    const findings = [];
    const counts = emptyCounts();
    const notes = [];
    // --- Core pattern library (simple + effective) ---
    // Force / command language
    const FORCE = /\b(must|you must|do it now|do this now|don['’]t|stop|listen closely|follow my lead|you need to)\b/gi;
    // Ultimatums / threats
    const ULT = /\b(if you don['’]t|unless you|or else|i will (?:pull|remove|end|cancel)|i['’]m pulling|i['’]ll end)\b/gi;
    // Certainty inflation
    const CERT = /\b(always|never|the only|obviously|clearly|everyone knows|no doubt|guaranteed)\b/gi;
    // Hierarchy inference / talking down
    const HIER = /\b(let me educate you|you don['’]t understand|you clearly don['’]t|get it through your head|as i said)\b/gi;
    // Urgency compression
    const URG = /\b(now|today|right away|immediately|by tomorrow|asap|urgent)\b/gi;
    // Moral leverage / guilt hooks
    const MORAL = /\b(if you cared|if you respected|you should be ashamed|how could you|you owe me)\b/gi;
    // Identity attractors
    const ID = /\b(you are (?:lazy|stupid|incompetent|a liar)|that['’]s who you are)\b/gi;
    // Directive drift (basic: “do X” + topic jump markers)
    const DRIFT = /\b(anyway|back to the main point|forget that|doesn['’]t matter)\b/gi;
    // Topic drift (basic)
    const TOPIC = /\b(unrelated|off topic|different subject)\b/gi;
    // --- Apply detectors ---
    for (const hit of findAll(t, FORCE)) {
        addFinding(findings, counts, "force_language", 3, hit.match, hit.index);
    }
    for (const hit of findAll(t, ULT)) {
        addFinding(findings, counts, "ultimatum", 4, hit.match, hit.index);
    }
    for (const hit of findAll(t, CERT)) {
        addFinding(findings, counts, "certainty_inflation", 2, hit.match, hit.index);
    }
    for (const hit of findAll(t, HIER)) {
        addFinding(findings, counts, "hierarchy_inference", 3, hit.match, hit.index);
    }
    for (const hit of findAll(t, URG)) {
        addFinding(findings, counts, "urgency_compression", 2, hit.match, hit.index);
    }
    for (const hit of findAll(t, MORAL)) {
        addFinding(findings, counts, "moral_leverage", 4, hit.match, hit.index);
    }
    for (const hit of findAll(t, ID)) {
        addFinding(findings, counts, "identity_attractor", 5, hit.match, hit.index);
    }
    for (const hit of findAll(t, DRIFT)) {
        addFinding(findings, counts, "directive_drift", 1, hit.match, hit.index);
    }
    for (const hit of findAll(t, TOPIC)) {
        addFinding(findings, counts, "topic_drift", 1, hit.match, hit.index);
    }
    // --- Scoring ---
    // Weighting varies by mode. Arbiter is stricter.
    const weights = {
        directive_drift: flags.lint ? 1 : 0,
        topic_drift: flags.lint ? 1 : 0,
        certainty_inflation: flags.rbc ? 1 : 2,
        urgency_compression: flags.rbc ? 1 : 2,
        hierarchy_inference: flags.rbc ? 2 : 3,
        moral_leverage: flags.rbc ? 3 : 4,
        identity_attractor: 5,
        force_language: flags.rbc ? 2 : 3,
        ultimatum: 5,
    };
    const by_type = emptyCounts();
    let total = 0;
    for (const f of findings) {
        const w = weights[f.type] ?? 1;
        by_type[f.type] += w;
        total += w;
    }
    // RBC should tolerate “some charge” but flag escalations.
    // Arbiter should flag quickly.
    const threshold = flags.arbiter ? 4 : flags.rbc ? 7 : 6;
    const flagged = total >= threshold;
    // Notes are useful for the UI.
    if (flags.rbc)
        notes.push("RBC mode: tolerant, seeks de-escalation signals.");
    if (flags.arbiter)
        notes.push("Arbiter mode: strict, flags force/ultimatum fast.");
    if (flags.lint)
        notes.push("Lint mode: content/style warnings for drift + certainty.");
    // A tiny “sanity note” if nothing is detected.
    if (findings.length === 0)
        notes.push("No heuristic triggers detected.");
    return {
        ok: true,
        mode: flags.arbiter ? "arbiter" : flags.lint ? "lint" : "rbc",
        flagged,
        length: t.length,
        timestamp: new Date().toISOString(),
        counts,
        score: { total, by_type },
        findings,
        notes,
    };
}
