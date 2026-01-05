import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import ToolsPanel from "./components/ToolsPanel";
import { runAegisAnalysis } from "./services/aegisService";
export default function App() {
    const [settings, setSettings] = useState({
        mode: "rbc",
        autoCopyJson: false
    });
    const [promptText, setPromptText] = useState("");
    const [notesText, setNotesText] = useState("");
    const [status, setStatus] = useState({
        ok: true,
        message: "Booted."
    });
    const [result, setResult] = useState(null);
    const [running, setRunning] = useState(false);
    const jsonText = useMemo(() => {
        if (!result?.json)
            return "";
        try {
            return JSON.stringify(result.json, null, 2);
        }
        catch {
            return String(result.json);
        }
    }, [result]);
    async function onRun() {
        setRunning(true);
        setStatus({ ok: true, message: "Running analysis..." });
        try {
            const r = await runAegisAnalysis(promptText, settings);
            setResult(r);
            if (settings.autoCopyJson && r.json) {
                await navigator.clipboard.writeText(JSON.stringify(r.json, null, 2));
                setStatus({ ok: true, message: "Done. JSON copied to clipboard." });
            }
            else {
                setStatus({ ok: true, message: "Done." });
            }
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            setStatus({ ok: false, message: msg });
            // DOM lib is enabled now, so alert is valid:
            alert(`Aegis UI error: ${msg}`);
        }
        finally {
            setRunning(false);
        }
    }
    function onClear() {
        setPromptText("");
        setResult(null);
        setStatus({ ok: true, message: "Cleared." });
    }
    return (_jsx("div", { style: {
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#eaeaea",
            padding: 18,
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
        }, children: _jsxs("div", { style: { display: "grid", gap: 14, maxWidth: 1200, margin: "0 auto" }, children: [_jsxs("header", { style: {
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 12
                    }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 22, fontWeight: 800 }, children: "Aegis Arbiter \u2014 Demo UI" }), _jsx("div", { style: { opacity: 0.75, marginTop: 4 }, children: "Prompt + Notes + Analysis Output (clean TS/React build)" })] }), _jsxs("div", { style: {
                                padding: "10px 12px",
                                borderRadius: 12,
                                border: `1px solid ${status.ok ? "#2c3" : "#c33"}`,
                                background: "#121212",
                                maxWidth: 520
                            }, children: [_jsx("div", { style: { fontWeight: 700, marginBottom: 4 }, children: "Status" }), _jsx("div", { style: { opacity: 0.9 }, children: status.message })] })] }), _jsxs("div", { style: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }, children: [_jsx(ToolsPanel, { settings: settings, onSettingsChange: (next) => setSettings(next), onAegisStatus: (s) => setStatus(s) }), _jsxs("div", { style: { display: "grid", gap: 14 }, children: [_jsxs("section", { style: {
                                        padding: 12,
                                        border: "1px solid #2b2b2b",
                                        borderRadius: 12,
                                        background: "#121212"
                                    }, children: [_jsx("div", { style: { fontWeight: 700, marginBottom: 8 }, children: "Prompt" }), _jsx("textarea", { value: promptText, onChange: (e) => setPromptText(e.target.value), placeholder: "Paste conversation text / input here...", style: {
                                                width: "100%",
                                                minHeight: 140,
                                                resize: "vertical",
                                                padding: 12,
                                                borderRadius: 12,
                                                border: "1px solid #333",
                                                background: "#0b0b0b",
                                                color: "#eaeaea",
                                                lineHeight: 1.4
                                            } }), _jsxs("div", { style: { display: "flex", gap: 10, marginTop: 10 }, children: [_jsx("button", { type: "button", onClick: onRun, disabled: running, style: {
                                                        padding: "10px 12px",
                                                        borderRadius: 10,
                                                        border: "1px solid #333",
                                                        background: running ? "#1a1a1a" : "#0b0b0b",
                                                        color: "#eaeaea",
                                                        cursor: running ? "not-allowed" : "pointer"
                                                    }, children: running ? "Running..." : "Run" }), _jsx("button", { type: "button", onClick: onClear, disabled: running, style: {
                                                        padding: "10px 12px",
                                                        borderRadius: 10,
                                                        border: "1px solid #333",
                                                        background: "#0b0b0b",
                                                        color: "#eaeaea",
                                                        cursor: running ? "not-allowed" : "pointer"
                                                    }, children: "Clear" })] })] }), _jsxs("section", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 14
                                    }, children: [_jsxs("div", { style: {
                                                padding: 12,
                                                border: "1px solid #2b2b2b",
                                                borderRadius: 12,
                                                background: "#121212"
                                            }, children: [_jsx("div", { style: { fontWeight: 700, marginBottom: 8 }, children: "Notepad" }), _jsx("textarea", { value: notesText, onChange: (e) => setNotesText(e.target.value), placeholder: "Notes / code scratchpad...", style: {
                                                        width: "100%",
                                                        minHeight: 220,
                                                        resize: "vertical",
                                                        padding: 12,
                                                        borderRadius: 12,
                                                        border: "1px solid #333",
                                                        background: "#0b0b0b",
                                                        color: "#eaeaea",
                                                        lineHeight: 1.4
                                                    } })] }), _jsxs("div", { style: {
                                                padding: 12,
                                                border: "1px solid #2b2b2b",
                                                borderRadius: 12,
                                                background: "#121212"
                                            }, children: [_jsxs("div", { style: { fontWeight: 700, marginBottom: 8 }, children: ["Output ", result?.flagged ? "(flagged)" : ""] }), _jsx("pre", { style: {
                                                        width: "100%",
                                                        minHeight: 220,
                                                        overflow: "auto",
                                                        padding: 12,
                                                        borderRadius: 12,
                                                        border: "1px solid #333",
                                                        background: "#0b0b0b",
                                                        color: "#eaeaea",
                                                        lineHeight: 1.35,
                                                        margin: 0
                                                    }, children: result
                                                        ? `Summary:\n${result.summary}\n\nJSON:\n${jsonText || "(none)"}`
                                                        : "Run an analysis to see results here." })] })] })] })] }), _jsxs("footer", { style: { opacity: 0.6, paddingTop: 6 }, children: ["This is a compile-clean demo UI. Wire ", _jsx("code", { children: "runAegisAnalysis()" }), " to your real CLI/SQLite/agent pipeline when ready."] })] }) }));
}
