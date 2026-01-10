import React, { useRef, useState } from 'react';
import "./MirrorApp.css";
import { GlassGate } from './components/GlassGate';
import { TrajectoryMap } from './components/TrajectoryMap';
import { SpineExplorer } from './components/SpineExplorer';
import { apiUrl } from "./lib/apiBase";

const styles = {
  container: "mirror-app-container",
  journal: "mirror-app-journal",
  button: "mirror-app-button",
};

/**
 * MirrorApp provides the full-featured interface for self-reflection.
 * It fulfills AXIOM_5_AWARENESS.
 */
export const MirrorApp: React.FC = () => {
  const [reflection, setReflection] = useState("");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [idsBlock, setIdsBlock] = useState<any>(null);
  const [alignment, setAlignment] = useState<string | null>(null);
  const [lenses, setLenses] = useState<{
    physical?: number;
    emotional?: number;
    mental?: number;
    spiritual?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`mirror_${Date.now()}`);
  const [recordingMode, setRecordingMode] = useState<"audio" | "video" | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const MAX_RECORDING_MS = 3 * 60 * 1000;

  const describeLevel = (value?: number) => {
    if (typeof value !== "number") return "Unknown";
    if (value >= 0.75) return "High";
    if (value >= 0.45) return "Steady";
    if (value >= 0.25) return "Low";
    return "Depleted";
  };

  const levelTone = (value?: number) => {
    if (typeof value !== "number") return "unknown";
    if (value >= 0.75) return "strong";
    if (value >= 0.45) return "steady";
    if (value >= 0.25) return "low";
    return "critical";
  };

  const normalizeLenses = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    const { physical, emotional, mental, spiritual } = payload as {
      physical?: number;
      emotional?: number;
      mental?: number;
      spiritual?: number;
    };
    const hasValue = [physical, emotional, mental, spiritual].some(
      (value) => typeof value === "number"
    );
    return hasValue ? { physical, emotional, mental, spiritual } : null;
  };

  const applyMirrorResponse = (data: any, fallbackTranscript?: string) => {
    setIdsBlock(data?.ids ?? null);
    setAlignment(data?.alignment ?? null);
    const nextLenses =
      normalizeLenses(data?.lenses) ?? normalizeLenses(data?.telemetry?.lenses);
    setLenses(nextLenses);
    setTranscript((data?.transcript ?? fallbackTranscript ?? "").trim() || null);
  };

  const handleInhale = async () => {
    // Fulfills AXIOM_6_CHOICE to initiate processing
    const trimmed = reflection.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl("/mirror/reflect"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text: trimmed })
      });
      const data = await res.json();

      if (!res.ok || data?.ok === false) {
        setError(data?.error ?? "Mirror reflection failed.");
        setIdsBlock(null);
        setAlignment(null);
        setLenses(null);
        setTranscript(null);
        return;
      }

      applyMirrorResponse(data, trimmed);
    } catch (err) {
      setError("Unable to reach the mirror service.");
      setIdsBlock(null);
      setAlignment(null);
      setLenses(null);
      setTranscript(null);
    } finally {
      setIsLoading(false);
    }
  };

  const canInhale = reflection.trim().length > 0 && !isLoading;
  const emotionalValue = lenses?.emotional;
  const emotionalTone = levelTone(emotionalValue);
  const hasOutput = Boolean(idsBlock || alignment || lenses);

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async (mode: "audio" | "video") => {
    if (recordingMode || isLoading) return;
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === "video"
      });

      const preferredType = mode === "video" ? "video/webm" : "audio/webm";
      const options =
        MediaRecorder.isTypeSupported(preferredType) ? { mimeType: preferredType } : undefined;

      const recorder = new MediaRecorder(stream, options);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (timerRef.current) window.clearInterval(timerRef.current);

        const recordedChunks = chunksRef.current;
        chunksRef.current = [];
        setRecordingMode(null);
        setRecordingSeconds(0);

        if (recordedChunks.length === 0) {
          setError("No recording data captured.");
          return;
        }

        const blob = new Blob(recordedChunks, { type: recorder.mimeType });
        setIsLoading(true);
        setError(null);

        try {
          const res = await fetch(
            apiUrl(`/mirror/reflect-media?sessionId=${sessionId}`),
            {
              method: "POST",
              headers: {
                "Content-Type": blob.type || "application/octet-stream"
              },
              body: blob
            }
          );
          const data = await res.json();

          if (!res.ok || data?.ok === false) {
            setError(data?.error ?? "Mirror reflection failed.");
            setIdsBlock(null);
            setAlignment(null);
            setLenses(null);
            setTranscript(null);
            return;
          }

          applyMirrorResponse(data);
        } catch (err) {
          setError("Unable to reach the mirror service.");
          setIdsBlock(null);
          setAlignment(null);
          setLenses(null);
          setTranscript(null);
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecordingMode(mode);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      timeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_MS);
    } catch (err) {
      setError("Microphone or camera access was denied.");
    }
  };

  const toggleRecording = (mode: "audio" | "video") => {
    if (recordingMode === mode) {
      stopRecording();
    } else {
      startRecording(mode);
    }
  };

  const formatRecordingTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleClear = () => {
    setReflection("");
    setIdsBlock(null);
    setAlignment(null);
    setLenses(null);
    setTranscript(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <header className="mirror-topbar">
        <div className="mirror-brand">
          <p className="mirror-eyebrow">Mirror Reflect Connect</p>
          <h1 className="mirror-title">Reflection Interface</h1>
        </div>
        <div className="mirror-status">
          <span className="mirror-pill">Session {sessionId}</span>
          <span className="mirror-pill mirror-pill-quiet">Coherence live</span>
        </div>
      </header>

      <div className="mirror-layout">
        <section className="mirror-column mirror-left">
          <div className="mirror-card mirror-transcript">
            <div className="mirror-card-header">
              <h2 className="mirror-card-title">Audio transcript</h2>
              <span className="mirror-badge">
                {recordingMode ? `Recording ${recordingMode}` : "Listening"}
              </span>
            </div>
            <p className="mirror-muted">
              {transcript
                ? transcript
                : reflection
                  ? reflection
                  : "Transcript will appear here when audio capture is enabled."}
            </p>
            {recordingMode && (
              <p className="mirror-recording">
                {formatRecordingTime(recordingSeconds)} / 3:00 max
              </p>
            )}
          </div>

          <div className="mirror-card mirror-display">
            <div className="mirror-card-header">
              <h2 className="mirror-card-title">Reflection mirror</h2>
              <span className="mirror-badge">Output</span>
            </div>
            <div className="mirror-output">
              {!hasOutput && (
                <p className="mirror-muted">
                  Reflection output will render here after initiation.
                </p>
              )}
              {alignment && (
                <p className="mirror-insight-alignment">{alignment}</p>
              )}
              {typeof emotionalValue === "number" && (
                <div className="mirror-emotion-card">
                  <p className="mirror-insight-label">Peer emotional state</p>
                  <div className="mirror-emotion-row">
                    <span className="mirror-emotion-value">
                      {Math.round(emotionalValue * 100)}%
                    </span>
                    <span className={`mirror-emotion-level mirror-emotion-${emotionalTone}`}>
                      {describeLevel(emotionalValue)}
                    </span>
                  </div>
                  <p className="mirror-emotion-note">
                    Resonance from the emotional lens; grounded in current telemetry.
                  </p>
                </div>
              )}
              {idsBlock ? (
                <div className="mirror-ids-block">
                  <div className="mirror-insight-grid">
                    <div>
                      <p className="mirror-insight-label">Identify</p>
                      <p className="mirror-insight-value">{idsBlock.identify}</p>
                    </div>
                    <div>
                      <p className="mirror-insight-label">Define</p>
                      <p className="mirror-insight-value">{idsBlock.define}</p>
                    </div>
                  </div>
                  <ul className="mirror-insight-list">
                    {idsBlock.suggest.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                hasOutput && (
                  <p className="mirror-insight-empty">
                    Reflection received. The mirror has no axioms to surface yet.
                  </p>
                )
              )}
            </div>
          </div>

          <div className="mirror-lower-row">
            <div className="mirror-card">
              <h3 className="mirror-card-title">ST recordings</h3>
              <TrajectoryMap sessionId={sessionId} />
            </div>
            <div className="mirror-card">
              <h3 className="mirror-card-title">Past records</h3>
              <SpineExplorer sessionId={sessionId} />
            </div>
          </div>
        </section>

        <aside className="mirror-column mirror-right">
          <div className="mirror-card mirror-chat">
            <div className="mirror-card-header">
              <h2 className="mirror-card-title">Reflection chamber chat</h2>
              <span className="mirror-badge">Input</span>
            </div>
            <textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Begin your reflection..."
              className={styles.journal}
            />
            <div className="mirror-chat-actions">
              <button
                type="button"
                onClick={handleInhale}
                className={styles.button}
                disabled={!canInhale}
              >
                {isLoading ? "Inhaling..." : "Initiate"}
              </button>
              <button type="button" className="mirror-ghost" onClick={handleClear}>
                Clear
              </button>
              <button
                type="button"
                className="mirror-ghost"
                onClick={() => toggleRecording("audio")}
                disabled={isLoading || (recordingMode !== null && recordingMode !== "audio")}
              >
                <span>
                  {recordingMode === "audio" ? "Stop audio" : "Audio record"}
                </span>
              </button>
              <button
                type="button"
                className="mirror-ghost"
                onClick={() => toggleRecording("video")}
                disabled={isLoading || (recordingMode !== null && recordingMode !== "video")}
              >
                <span>
                  {recordingMode === "video" ? "Stop video" : "Video record"}
                </span>
              </button>
              <button type="button" className="mirror-ghost" onClick={handleClear}>
                Clear chat window
              </button>
              <button type="button" className="mirror-ghost" disabled={!hasOutput}>
                Download report
              </button>
            </div>
            {error && <div className="mirror-app-error">{error}</div>}
          </div>

          <div className="mirror-card mirror-telemetry">
            <h3 className="mirror-card-title">Peer status audio</h3>
            <GlassGate />
          </div>
        </aside>
      </div>
    </div>
  );
}

