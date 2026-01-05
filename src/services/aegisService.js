export async function runAegisAnalysis(input, settings) {
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
        notepad: ""
    };
    const res = await fetch("http://localhost:8787/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    // Try to parse JSON even on errors (server may return useful details)
    let data = null;
    try {
        data = await res.json();
    }
    catch {
        // ignore
    }
    if (!res.ok) {
        const msg = (data && (data.error || data.message || data.detail)) ||
            `Server error (${res.status})`;
        throw new Error(msg);
    }
    // Normalize to your UI's AnalysisResult shape
    // Expecting server to return something like { flagged, counts, score, findings, notes, ... }
    const flagged = Boolean(data?.json?.flagged ?? data?.flagged);

const summary =
  typeof data?.summary === "string"
    ? data.summary
    : flagged
    ? `FLAGGED — ${settings.mode} mode`
    : `CLEAN — ${settings.mode} mode`;

return {
  flagged,
  summary,
  json: data?.json ?? data
};

}
