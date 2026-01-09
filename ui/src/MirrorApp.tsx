import React, { useState } from 'react';
import "./MirrorApp.css";
import { GlassGate } from './components/GlassGate';
import { TrajectoryMap } from './components/TrajectoryMap';
import { SpineExplorer } from './components/SpineExplorer';

const styles = {
  container: "mirror-app-container",
  grid: "mirror-app-grid",
  header: "mirror-app-header",
  sidebar: "mirror-app-sidebar",
  main: "mirror-app-main",
  journal: "mirror-app-journal",
  button: "mirror-app-button",
  idsSection: "mirror-app-ids-section",
  telemetry: "mirror-app-telemetry",
};

/**
 * MirrorApp provides the full-featured interface for self-reflection.
 * It fulfills AXIOM_5_AWARENESS.
 */
export const MirrorApp: React.FC = () => {
  const [reflection, setReflection] = useState("");
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

  const handleInhale = async () => {
    // Fulfills AXIOM_6_CHOICE to initiate processing
    const trimmed = reflection.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mirror/reflect", {
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
        return;
      }

      setIdsBlock(data.ids ?? null);
      setAlignment(data.alignment ?? null);
      const nextLenses = normalizeLenses(data?.lenses) ?? normalizeLenses(data?.telemetry?.lenses);
      setLenses(nextLenses);
    } catch (err) {
      setError("Unable to reach the mirror service.");
      setIdsBlock(null);
      setAlignment(null);
      setLenses(null);
    } finally {
      setIsLoading(false);
    }
  };

  const canInhale = reflection.trim().length > 0 && !isLoading;
  const emotionalValue = lenses?.emotional;
  const emotionalTone = levelTone(emotionalValue);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className="mirror-app-brand">
          <p className="mirror-app-eyebrow">Mirror Reflect Connect</p>
          <h1 className="mirror-app-title">Mirror Field Interface</h1>
          <p className="mirror-app-subtitle">
            Tune your reflection, map the drift, and reconnect to your signal.
          </p>
        </div>
        <div className="mirror-app-status">
          <span className="mirror-app-pill">Session {sessionId}</span>
          <span className="mirror-app-pill mirror-app-pill-quiet">Coherence live</span>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Sidebar: Historical Perspective */}
        <aside className={styles.sidebar}>
          <div className="mirror-card mirror-animate-1">
            <TrajectoryMap sessionId={sessionId} />
          </div>
          <div className="mirror-card mirror-animate-2">
            <SpineExplorer sessionId={sessionId} />
          </div>
        </aside>

        {/* Center: The Interactive Mirror */}
        <main className={styles.main}>
          <section className="mirror-card mirror-card-primary mirror-animate-1">
            <div className="mirror-card-header">
              <div>
                <h2 className="mirror-card-title">Reflection chamber</h2>
                <p className="mirror-card-subtitle">
                  Capture the current signal, then inhale to surface your axioms.
                </p>
              </div>
              <div className="mirror-card-meta">Focus window: 12 minutes</div>
            </div>
            <textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Begin your reflection..."
              className={styles.journal}
            />
            <div className="mirror-app-actions">
              <button onClick={handleInhale} className={styles.button} disabled={!canInhale}>
                {isLoading ? "Inhaling..." : "Initiate inhale"}
              </button>
              <div className="mirror-app-hint">Save a clear intent before continuing.</div>
            </div>
            {error && <div className="mirror-app-error">{error}</div>}
          </section>

          {(idsBlock || alignment || lenses) && (
            <section className={`${styles.idsSection} mirror-animate-2`}>
              <h3 className="mirror-card-title">Chamber response</h3>
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
                <>
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
                </>
              ) : (
                <p className="mirror-insight-empty">
                  Reflection received. The mirror has no axioms to surface yet.
                </p>
              )}
            </section>
          )}
        </main>

        {/* Right: Real-time Awareness (The Glass Gate) */}
        <aside className={styles.telemetry}>
          <div className="mirror-card mirror-animate-1">
            <GlassGate />
          </div>
          <div className="mirror-card mirror-animate-3 mirror-ritual">
            <h3 className="mirror-card-title">Connection ritual</h3>
            <ol>
              <li>Notice the strongest lens and name it.</li>
              <li>Mirror the tension without judgment.</li>
              <li>Choose one action that restores balance.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

