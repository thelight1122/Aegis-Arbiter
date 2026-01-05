import React, { useMemo, useState } from "react";
import ToolsPanel from "./components/ToolsPanel";
import { runAegisAnalysis } from "./services/aegisService";
import type { AegisStatus, AnalysisResult, ToolSettings } from "./types";

export default function App() {
  const [settings, setSettings] = useState<ToolSettings>({
    mode: "rbc",
    autoCopyJson: false
  });

  const [promptText, setPromptText] = useState<string>("");
  const [notesText, setNotesText] = useState<string>("");

  const [status, setStatus] = useState<AegisStatus>({
    ok: true,
    message: "Booted."
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const jsonText = useMemo(() => {
    if (!result?.json) return "";
    try {
      return JSON.stringify(result.json, null, 2);
    } catch {
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
      } else {
        setStatus({ ok: true, message: "Done." });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ ok: false, message: msg });
      // DOM lib is enabled now, so alert is valid:
      alert(`Aegis UI error: ${msg}`);
    } finally {
      setRunning(false);
    }
  }

  function onClear() {
    setPromptText("");
    setResult(null);
    setStatus({ ok: true, message: "Cleared." });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#eaeaea",
        padding: 18,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
      }}
    >
      <div style={{ display: "grid", gap: 14, maxWidth: 1200, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              Aegis Arbiter — Demo UI
            </div>
            <div style={{ opacity: 0.75, marginTop: 4 }}>
              Prompt + Notes + Analysis Output (clean TS/React build)
            </div>
          </div>

          <div
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: `1px solid ${status.ok ? "#2c3" : "#c33"}`,
              background: "#121212",
              maxWidth: 520
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Status</div>
            <div style={{ opacity: 0.9 }}>{status.message}</div>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
          <ToolsPanel
            settings={settings}
            onSettingsChange={(next: ToolSettings) => setSettings(next)}
            onAegisStatus={(s: AegisStatus) => setStatus(s)}
          />

          <div style={{ display: "grid", gap: 14 }}>
            <section
              style={{
                padding: 12,
                border: "1px solid #2b2b2b",
                borderRadius: 12,
                background: "#121212"
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Prompt</div>
              <textarea
                value={promptText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPromptText(e.target.value)
                }
                placeholder="Paste conversation text / input here..."
                style={{
                  width: "100%",
                  minHeight: 140,
                  resize: "vertical",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #333",
                  background: "#0b0b0b",
                  color: "#eaeaea",
                  lineHeight: 1.4
                }}
              />

              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={onRun}
                  disabled={running}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: running ? "#1a1a1a" : "#0b0b0b",
                    color: "#eaeaea",
                    cursor: running ? "not-allowed" : "pointer"
                  }}
                >
                  {running ? "Running..." : "Run"}
                </button>

                <button
                  type="button"
                  onClick={onClear}
                  disabled={running}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#0b0b0b",
                    color: "#eaeaea",
                    cursor: running ? "not-allowed" : "pointer"
                  }}
                >
                  Clear
                </button>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14
              }}
            >
              <div
                style={{
                  padding: 12,
                  border: "1px solid #2b2b2b",
                  borderRadius: 12,
                  background: "#121212"
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Notepad</div>
                <textarea
                  value={notesText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNotesText(e.target.value)
                  }
                  placeholder="Notes / code scratchpad..."
                  style={{
                    width: "100%",
                    minHeight: 220,
                    resize: "vertical",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #333",
                    background: "#0b0b0b",
                    color: "#eaeaea",
                    lineHeight: 1.4
                  }}
                />
              </div>

              <div
                style={{
                  padding: 12,
                  border: "1px solid #2b2b2b",
                  borderRadius: 12,
                  background: "#121212"
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  Output {result?.flagged ? "(flagged)" : ""}
                </div>

                <pre
                  style={{
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
                  }}
                >
                  {result
                    ? `Summary:\n${result.summary}\n\nJSON:\n${jsonText || "(none)"}`
                    : "Run an analysis to see results here."}
                </pre>
              </div>
            </section>
          </div>
        </div>

        <footer style={{ opacity: 0.6, paddingTop: 6 }}>
          This is a compile-clean demo UI. Wire <code>runAegisAnalysis()</code> to
          your real CLI/SQLite/agent pipeline when ready.
        </footer>
      </div>
    </div>
  );
}
