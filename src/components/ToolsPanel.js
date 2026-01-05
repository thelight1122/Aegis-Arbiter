import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ToolsPanel({ settings, onSettingsChange, onAegisStatus }) {
    function setMode(e) {
        const mode = e.currentTarget.value;
        onSettingsChange({ ...settings, mode });
        onAegisStatus({ ok: true, message: `Mode set: ${mode}` });
    }
    function toggleAutoCopy(e) {
        onSettingsChange({ ...settings, autoCopyJson: e.currentTarget.checked });
    }
    return (_jsxs("div", { style: {
            padding: 12,
            border: "1px solid #2b2b2b",
            borderRadius: 12,
            background: "#121212",
            color: "#eaeaea"
        }, children: [_jsx("div", { style: { fontWeight: 700, marginBottom: 10 }, children: "Tools" }), _jsxs("div", { style: { display: "grid", gap: 10 }, children: [_jsxs("label", { style: { display: "grid", gap: 6 }, children: [_jsx("span", { style: { opacity: 0.85 }, children: "Mode" }), _jsxs("select", { "aria-label": "Aegis mode", value: settings.mode, onChange: setMode, style: {
                                    padding: 10,
                                    borderRadius: 10,
                                    border: "1px solid #333",
                                    background: "#0b0b0b",
                                    color: "#eaeaea"
                                }, children: [_jsx("option", { value: "rbc", children: "RBC" }), _jsx("option", { value: "arbiter", children: "Arbiter" }), _jsx("option", { value: "telemetry", children: "Telemetry" })] })] }), _jsxs("label", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [_jsx("input", { type: "checkbox", checked: settings.autoCopyJson, onChange: toggleAutoCopy }), _jsx("span", { style: { opacity: 0.85 }, children: "Auto-copy JSON output" })] }), _jsx("button", { type: "button", onClick: () => onAegisStatus({ ok: true, message: "UI ready (demo)." }), style: {
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #333",
                            background: "#0b0b0b",
                            color: "#eaeaea",
                            cursor: "pointer"
                        }, children: "Ping" })] })] }));
}
