/**
 * Demo stub: Replace this with real wiring to your CLI or server.
 * The UI compiles cleanly regardless.
 */
export async function runAegisAnalysis(input, settings) {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 150));
    const trimmed = input.trim();
    if (!trimmed) {
        return {
            flagged: false,
            summary: "No input provided.",
            json: { flagged: false, findings: [] }
        };
    }
    // Fake “flagging” for demo: detect obviously forceful words
    const forceWords = ["must", "never", "always", "do this now", "listen closely"];
    const hit = forceWords.some((w) => trimmed.toLowerCase().includes(w));
    return {
        flagged: hit,
        summary: hit
            ? `Flagged in ${settings.mode} mode (demo heuristic).`
            : `Clean in ${settings.mode} mode (demo heuristic).`,
        json: {
            mode: settings.mode,
            flagged: hit,
            length: trimmed.length,
            timestamp: new Date().toISOString()
        }
    };
}
