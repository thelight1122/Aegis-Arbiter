import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import ToolsPanel from "./components/ToolsPanel";
import { runAegisAnalysis } from "./services/aegisService";
import "./App.css";
export default function App() {
    const [settings, setSettings] = useState({
        mode: "rbc",
        autoCopyJson: false
    });
    const [promptText, setPromptText] = useState("");
    const [notesText, setNotesText] = useState("");
    const [status, setStatus] = useState({ ok: true, message: "Booted." });
    const [result, setResult] = useState(null);
    const [running, setRunning] = useState(false);
    const [showJson, setShowJson] = useState(false);
    const analyzer = (result?.json ?? null);
    const summaryText = result?.summary ?? "";
    const scoreTotal = analyzer?.score?.total ?? 0;
    const findingsArr = Array.isArray(analyzer?.findings) ? analyzer.findings : [];
    const notesArr = Array.isArray(analyzer?.notes) ? analyzer.notes : [];
    const countsObj = analyzer?.counts ?? {};
    const nonZeroCounts = useMemo(() => {
        return Object.entries(countsObj).filter(([, v]) => Number(v) > 0);
    }, [analyzer]);
    const jsonText = useMemo(() => {
        if (!analyzer)
            return "";
        try {
            return JSON.stringify(analyzer, null, 2);
        }
        catch {
            return String(analyzer);
        }
    }, [analyzer]);
    async function onRun() {
        setRunning(true);
        setStatus({ ok: true, message: "Running analysis..." });
        try {
            const r = await runAegisAnalysis(promptText, settings, notesText);
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
            alert(msg);
        }
        finally {
            setRunning(false);
        }
    }
    function onClear() {
        setPromptText("");
        setNotesText("");
        setResult(null);
        setShowJson(false);
        setStatus({ ok: true, message: "Cleared." });
    }
    return (_jsx("div", { className: "app", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { children: [_jsx("div", { className: "title", children: "Aegis Arbiter" }), _jsx("div", { className: "subtitle", children: "Live Analyzer" })] }), _jsxs("div", { className: `status ${status.ok ? "ok" : "error"}`, children: [_jsx("div", { className: "status-title", children: "Status" }), _jsx("div", { className: "status-message", children: status.message })] })] }), _jsxs("div", { className: "main-grid", children: [_jsx(ToolsPanel, { settings: settings, onSettingsChange: setSettings, onAegisStatus: setStatus }), _jsxs("div", { className: "right-grid", children: [_jsxs("section", { className: "section", children: [_jsx("div", { className: "section-title", children: "Prompt" }), _jsx("label", { className: "sr-only", htmlFor: "prompt-input", children: "Prompt input" }), _jsx("textarea", { id: "prompt-input", className: "textarea", value: promptText, onChange: (e) => setPromptText(e.target.value), placeholder: "Paste conversation text / input here..." }), _jsxs("div", { className: "button-row", children: [_jsx("button", { onClick: onRun, disabled: running, children: running ? "Running..." : "Run" }), _jsx("button", { onClick: onClear, disabled: running, children: "Clear" })] })] }), _jsxs("section", { className: "output-grid", children: [_jsxs("div", { className: "section", children: [_jsx("div", { className: "section-title", children: "Notepad" }), _jsx("label", { className: "sr-only", htmlFor: "notepad-input", children: "Notepad input" }), _jsx("textarea", { id: "notepad-input", className: "notepad-textarea", value: notesText, onChange: (e) => setNotesText(e.target.value), placeholder: "Notes / code scratchpad..." })] }), _jsxs("div", { className: "section", children: [_jsx("div", { className: "section-title", children: "Result" }), !result && _jsx("div", { children: "Run analysis to see results." }), result && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "result-stats", children: [_jsxs("div", { className: "result-summary", children: [_jsx("b", { children: "Summary:" }), " ", summaryText || "(none)"] }), _jsxs("div", { className: "result-badges", children: [_jsxs("span", { className: "badge", children: [_jsx("b", { children: "Score" }), ": ", scoreTotal] }), _jsxs("span", { className: "badge", children: [_jsx("b", { children: "Findings" }), ": ", findingsArr.length] }), _jsxs("span", { className: `badge ${result.flagged ? "badge-bad" : "badge-good"}`, children: [_jsx("b", { children: "Status" }), ": ", result.flagged ? "FLAGGED" : "CLEAN"] })] }), _jsxs("div", { className: "counts-block", children: [_jsx("div", { className: "counts-title", children: "Non-zero counts" }), _jsx("div", { className: "counts-line", children: nonZeroCounts.length
                                                                                ? nonZeroCounts.map(([k, v]) => (_jsxs("span", { className: "chip", children: [k, ": ", String(v)] }, k)))
                                                                                : _jsx("span", { className: "muted", children: "(none)" }) })] }), _jsxs("div", { className: "notes-block", children: [_jsx("div", { className: "counts-title", children: "Notes" }), notesArr.length ? (_jsx("ul", { className: "notes-list", children: notesArr.map((n, i) => (_jsx("li", { children: n }, i))) })) : (_jsx("div", { className: "muted", children: "(none)" }))] }), _jsx("div", { className: "json-toggle-row", children: _jsx("button", { type: "button", className: "button secondary", onClick: () => setShowJson((v) => !v), children: showJson ? "Hide JSON" : "Show JSON" }) })] }), showJson && _jsx("pre", { className: "output-pre", children: jsonText })] }))] })] })] })] })] }) }));
}
