import React, { useEffect, useState } from "react";
import "./GlassGate.css";
import { apiUrl } from "../lib/apiBase";

interface Telemetry {
  flow_energy: number;
  lenses: {
    physical: number;
    emotional: number;
    mental: number;
    spiritual: number;
  };
  tension: number;
  active_axioms: string[];
}

/**
 * The GlassGate component acts as a passive observer.
 * It fulfills AXIOM_5_AWARENESS.
 */
export const GlassGate: React.FC = () => {
  const [data, setData] = useState<Telemetry | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(apiUrl("/witness"));

    eventSource.onmessage = (event) => {
      const telemetry = JSON.parse(event.data) as Telemetry;
      setData(telemetry);
    };

    return () => eventSource.close();
  }, []);

  if (!data) return <div className="glass-gate-placeholder">Awaiting Resonance...</div>;

  return (
    <div className="glass-gate">
      <h3>Witness Stream: Glass Gate Active</h3>

      <div className="meters">
        <Meter label="Mental (Logic)" value={data.lenses.mental} />
        <Meter label="Emotional (Resonance)" value={data.lenses.emotional} />
        <Meter label="Physical (Resources)" value={data.lenses.physical} />
        <Meter label="Spiritual (Identity)" value={data.lenses.spiritual} />
      </div>

      <div className="status glass-gate-status">
        <p>
          <strong>ECU Tension:</strong> {(data.tension * 100).toFixed(0)}%
        </p>
        <p>
          <strong>Active Axioms:</strong> {data.active_axioms.join(" · ") || "None"}
        </p>
        <p>
          <strong>Flow Energy:</strong> {data.flow_energy.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const Meter = ({ label, value }: { label: string; value: number }) => (
  <div className="meter-row">
    <span className="meter-label">{label}:</span>
    <progress
      className={`meter-progress${value < 0.4 ? " meter-progress-low" : ""}`}
      value={value}
      max={1}
    />
  </div>
);

const schemaSql = `
  CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_energy REAL,
    lenses TEXT,
    tension REAL,
    active_axioms TEXT
  );
`;

const db = {
  exec: (_sql: string) => {
    // noop: schema management is handled elsewhere
  },
};

db.exec(schemaSql);
