export async function runAegisAnalysis(input, settings, notepad = "") {
    const trimmed = input.trim();
    if (!trimmed) {
        return {
            flagged: false,
            summary: "No input provided.",
            json: { flagged: false, findings: [] }
        };
    }
    const payload = {
        mode: settings.mode,
        prompt: trimmed,
        notepad
    };
    const res = await fetch("http://localhost:8787/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    let data = null;
    try {
        data = await res.json();
    }
    catch {
        // ignore parse errors
    }
    if (!res.ok) {
        const msg = (data && (data.error || data.message || data.detail)) ||
            `Server error (${res.status})`;
        throw new Error(msg);
    }
    /**
     * Server envelope shape:
     * {
     *   ok,
     *   mode,
     *   summary,
     *   json: { flagged, counts, score, findings, notes, ... },
     *   timestamp,
     *   elapsed_ms
     * }
     */
    const analyzer = data?.json ?? data;
    const flagged = Boolean(analyzer?.flagged);
    const summary = typeof data?.summary === "string"
        ? data.summary
        : flagged
            ? `FLAGGED — ${settings.mode} mode`
            : `CLEAN — ${settings.mode} mode`;
    return {
        flagged,
        summary,
        json: analyzer
    };
}
