import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AnalyzeResponse, Mode } from "./types";
import { analyze, ping } from "./lib/api";

function nowIso() {
  return new Date().toISOString();
}

function safeJsonStringify(x: unknown) {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return JSON.stringify({ error: "Could not stringify JSON" }, null, 2);
  }
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>("rbc");
  const [prompt, setPrompt] = useState<string>("what is your status");
  const [notepad, setNotepad] = useState<string>("");
  const [autoCopy, setAutoCopy] = useState<boolean>(false);

  const [status, setStatus] = useState<"Idle" | "Running" | "Done" | "Error">("Idle");
  const [statusDetail, setStatusDetail] = useState<string>("");

  const [output, setOutput] = useState<AnalyzeResponse | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  const outputText = useMemo(() => {
    if (!output) return "";
    const header =
      `Summary:\n${output.summary}\n\n` +
      `JSON:\n${safeJsonStringify(output.json)}\n`;
    const meta =
      `\n—\nmode=${output.mode} ok=${output.ok} ts=${output.timestamp}` +
      (typeof output.elapsed_ms === "number" ? ` elapsed_ms=${output.elapsed_ms}` : "");
    return header + meta;
  }, [output]);

  const outputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Light-touch backend readiness check for the top-right pill.
    let cancelled = false;
    (async () => {
      try {
        const p = await ping();
        if (cancelled) return;
        if (p.ok && p.status === "ready") {
          setStatusDetail("Ready");
        } else {
          setStatusDetail(p.detail ?? "Degraded");
        }
      } catch {
        if (!cancelled) setStatusDetail("Offline");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onRun() {
    setErrorText("");
    setStatus("Running");
    setOutput(null);

    const start = performance.now();

    try {
      const res = await analyze({ mode, prompt, notepad });

      // If server didn’t include timing, we add it on the client (helpful during bring-up).
      const elapsed_ms = res.elapsed_ms ?? Math.round(performance.now() - start);
      const enriched: AnalyzeResponse = { ...res, elapsed_ms };

      setOutput(enriched);
      setStatus("Done");

      if (autoCopy) {
        await copyToClipboard(safeJsonStringify(enriched.json));
      }

      // Focus output so it feels “real” when run completes.
      requestAnimationFrame(() => outputRef.current?.focus());
    } catch (e: any) {
      setStatus("Error");
      setErrorText(e?.message ?? "Unknown error");
    }
  }

  function onClear() {
    setPrompt("");
    setNotepad("");
    setOutput(null);
    setErrorText("");
    setStatus("Idle");
  }

  async function onPingButton() {
    setStatusDetail("Checking…");
    try {
      const p = await ping();
      setStatusDetail(p.ok ? (p.status === "ready" ? "Ready" : (p.detail ?? "Degraded")) : "Degraded");
    } catch {
      setStatusDetail("Offline");
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="title">Aegis Arbiter — Demo UI</div>
          <div className="subtitle">Prompt + Notes + Analysis Output (clean TS/React build)</div>
        </div>

        <div className="pill" aria-label="Status">
          <div className="pillLabel">Status</div>
          <div className="pillValue">{status === "Idle" ? statusDetail || "Idle" : status}</div>
        </div>
      </header>

      <div className="grid">
        <aside className="panel tools">
          <div className="panelTitle">Tools</div>

          <div className="field">
            <label className="label">Mode</label>
            <select className="select" value={mode} onChange={(e) => setMode(e.target.value as Mode)} aria-label="Mode">
              <option value="rbc">RBC</option>
              <option value="arbiter">Arbiter</option>
              <option value="lint">Lint</option>
            </select>
          </div>

          <label className="checkbox">
            <input type="checkbox" checked={autoCopy} onChange={(e) => setAutoCopy(e.target.checked)} />
            <span>Auto-copy JSON output</span>
          </label>

          <button className="btn" onClick={onPingButton}>Ping</button>

          <div className="hint">
            This UI is wired to <code>/api/analyze</code>. The server runs your CLI and returns real JSON.
          </div>
        </aside>

        <section className="panel prompt">
          <div className="panelTitle">Prompt</div>
          <textarea
            className="textarea tall"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt…"
          />
          <div className="row">
            <button className="btn primary" onClick={onRun} disabled={status === "Running"}>
              {status === "Running" ? "Running…" : "Run"}
            </button>
            <button className="btn" onClick={onClear} disabled={status === "Running"}>
              Clear
            </button>
          </div>

          {errorText && (
            <div className="errorBox">
              <div className="errorTitle">Error</div>
              <div className="errorText">{errorText}</div>
              <div className="errorMeta">ts={nowIso()}</div>
            </div>
          )}
        </section>

        <section className="panel notepad">
          <div className="panelTitle">Notepad</div>
          <textarea
            className="textarea"
            value={notepad}
            onChange={(e) => setNotepad(e.target.value)}
            placeholder="Notes / code scratchpad…"
          />
        </section>

        <section className="panel output">
          <div className="panelTitle">Output</div>
          <textarea
            ref={outputRef}
            className="textarea"
            value={output ? outputText : "Summary:\n\nJSON:\n"}
            readOnly
            aria-label="Output"
          />
        </section>
      </div>

      <footer className="footer">
        This is a compile-clean UI. Wire <code>/api/analyze</code> to your real CLI/SQLite/agent pipeline.
      </footer>
    </div>
  );
}
