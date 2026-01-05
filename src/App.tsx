import React, { useMemo, useState } from "react";
import ToolsPanel from "./components/ToolsPanel";
import { runAegisAnalysis } from "./services/aegisService";
import type { AegisStatus, AnalysisResult, ToolSettings } from "./types";
import "./App.css";

export default function App() {
  const [settings, setSettings] = useState<ToolSettings>({
    mode: "rbc",
    autoCopyJson: false
  });

  const [promptText, setPromptText] = useState("");
  const [notesText, setNotesText] = useState("");

  const [status, setStatus] = useState<AegisStatus>({ ok: true, message: "Booted." });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [running, setRunning] = useState(false);

  const [showJson, setShowJson] = useState(false);

  const analyzer = (result?.json ?? null) as any;

  const summaryText = result?.summary ?? "";
  const scoreTotal = analyzer?.score?.total ?? 0;
  const findingsArr = Array.isArray(analyzer?.findings) ? analyzer.findings : [];
  const notesArr = Array.isArray(analyzer?.notes) ? analyzer.notes : [];
  const countsObj = analyzer?.counts ?? {};

  const nonZeroCounts = useMemo(() => {
    return Object.entries(countsObj).filter(([, v]) => Number(v) > 0);
  }, [analyzer]);

  const jsonText = useMemo(() => {
    if (!analyzer) return "";
    try {
      return JSON.stringify(analyzer, null, 2);
    } catch {
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
      } else {
        setStatus({ ok: true, message: "Done." });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ ok: false, message: msg });
      alert(msg);
    } finally {
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

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <div className="title">Aegis Arbiter</div>
            <div className="subtitle">Live Analyzer</div>
          </div>

          <div className={`status ${status.ok ? "ok" : "error"}`}>
            <div className="status-title">Status</div>
            <div className="status-message">{status.message}</div>
          </div>
        </header>

        <div className="main-grid">
          <ToolsPanel
            settings={settings}
            onSettingsChange={setSettings}
            onAegisStatus={setStatus}
          />

          <div className="right-grid">
            <section className="section">
              <div className="section-title">Prompt</div>
              <label className="sr-only" htmlFor="prompt-input">
                Prompt input
              </label>
              <textarea
                id="prompt-input"
                className="textarea"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Paste conversation text / input here..."
              />

              <div className="button-row">
                <button onClick={onRun} disabled={running}>
                  {running ? "Running..." : "Run"}
                </button>
                <button onClick={onClear} disabled={running}>
                  Clear
                </button>
              </div>
            </section>

            <section className="output-grid">
              <div className="section">
                <div className="section-title">Notepad</div>
                <label className="sr-only" htmlFor="notepad-input">
                  Notepad input
                </label>
                <textarea
                  id="notepad-input"
                  className="notepad-textarea"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Notes / code scratchpad..."
                />
              </div>

              <div className="section">
                <div className="section-title">Result</div>

                {!result && <div>Run analysis to see results.</div>}

                {result && (
                  <>
                    <div className="result-stats">
                      <div className="result-summary">
                        <b>Summary:</b> {summaryText || "(none)"}
                      </div>

                      <div className="result-badges">
                        <span className="badge">
                          <b>Score</b>: {scoreTotal}
                        </span>
                        <span className="badge">
                          <b>Findings</b>: {findingsArr.length}
                        </span>
                        <span className={`badge ${result.flagged ? "badge-bad" : "badge-good"}`}>
                          <b>Status</b>: {result.flagged ? "FLAGGED" : "CLEAN"}
                        </span>
                      </div>

                      <div className="counts-block">
                        <div className="counts-title">Non-zero counts</div>
                        <div className="counts-line">
                          {nonZeroCounts.length
                            ? nonZeroCounts.map(([k, v]) => (
                                <span key={k} className="chip">
                                  {k}: {String(v)}
                                </span>
                              ))
                            : <span className="muted">(none)</span>}
                        </div>
                      </div>

                      <div className="notes-block">
                        <div className="counts-title">Notes</div>
                        {notesArr.length ? (
                          <ul className="notes-list">
                            {notesArr.map((n: string, i: number) => (
                              <li key={i}>{n}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="muted">(none)</div>
                        )}
                      </div>

                      <div className="json-toggle-row">
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => setShowJson((v) => !v)}
                        >
                          {showJson ? "Hide JSON" : "Show JSON"}
                        </button>
                      </div>
                    </div>

                    {showJson && <pre className="output-pre">{jsonText}</pre>}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
