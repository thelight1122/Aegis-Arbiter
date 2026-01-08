import React, { useState } from 'react';
import { GlassGate } from './components/GlassGate';
import { TrajectoryMap } from './components/TrajectoryMap';
import { SpineExplorer } from './components/SpineExplorer';

const styles = {
  container: "mirror-app-container",
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
  const [sessionId] = useState(`mirror_${Date.now()}`);

  const handleInhale = async () => {
    // Fulfills AXIOM_6_CHOICE to initiate processing
    const res = await fetch("/api/mirror/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, text: reflection })
    });
    const data = await res.json();
    setIdsBlock(data.ids);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar: Historical Perspective */}
      <aside className={styles.sidebar}>
        <TrajectoryMap sessionId={sessionId} />
        <SpineExplorer sessionId={sessionId} />
      </aside>

      {/* Center: The Interactive Mirror */}
      <main className={styles.main}>
        <h3>Self-Reflection Cockpit</h3>
        <textarea 
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Begin your reflection..."
          className={styles.journal}
        />
        <button onClick={handleInhale} className={styles.button}>
          INITIATE INHALE
        </button>

        {idsBlock && (
          <section className={styles.idsSection}>
            <h4>Axiomatic Reflection</h4>
            <p><strong>IDENTIFY:</strong> {idsBlock.identify}</p>
            <p><strong>DEFINE:</strong> {idsBlock.define}</p>
            <ul>
              {idsBlock.suggest.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Right: Real-time Awareness (The Glass Gate) */}
      <aside className={styles.telemetry}>
        <GlassGate />
      </aside>
    </div>
  );
};
