import { analyzeText } from "./analyzer.js";
function composeInput(prompt, notepad) {
    const p = (prompt ?? "").toString();
    const n = (notepad ?? "").toString();
    return `PROMPT:\n${p}\n\nNOTEPAD:\n${n}\n`;
}
function mapMode(mode) {
    if (mode === "arbiter")
        return { rbc: false, arbiter: true, lint: false };
    if (mode === "lint")
        return { rbc: false, arbiter: false, lint: true };
    return { rbc: true, arbiter: false, lint: false };
}
export async function runAegisCli(input) {
    const text = composeInput(input.prompt, input.notepad);
    const flags = mapMode(input.mode);
    return analyzeText(text, flags);
}
