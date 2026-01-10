// FILE: ui/src/components/GlassGate.tsx
import React, { useEffect, useRef, useState } from "react";
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
 *
 * NOTE:
 * - This UI polls /api/witness because the server currently returns JSON,
 *   not an SSE (text/event-stream) stream.
 * - If/when the server exposes an SSE endpoint, we can swap to EventSource cleanly.
 */
export const GlassGate: React.FC = () => {
  const [data, setData] = useState<Telemetry | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;

    const fetchTelemetry = async () => {
      try {
        setErr(null);
        const res = await fetch(apiUrl("/witness"), {
          method: "GET",
          headers: { "Accept": "application/json" },
        });

        const json = await res.json();

        // Support both shapes:
        // A) direct telemetry object
        // B) wrapper { ok: true, trend: ..., telemetry: {...} } (if you evolve it)
        const candidate = (json?.telemetry ?? json) as Partial<Telemetry>;

        const looksValid =
          candidate &&
          typeof candidate === "object" &&
          typeof candidate.flow_energy === "number" &&
          typeof candidate.tension === "number" &&
          candidate.lenses &&
          typeof candidate.lenses.mental === "number" &&
          typeof candidate.lenses.emotional === "number" &&
          typeof candidate.lenses.physical === "number" &&
          typeof candidate.lenses.spiritual === "number" &&
          Array.isArray(candidate.active_axioms);

        if (!res.ok) {
          throw new Error(json?.error ?? `Witness returned HTTP ${res.status}`);
        }

        if (looksValid && aliveRef.current) {
          setData(candidate as Telemetry);
        } else {
          // If the server returns a minimal payload (like your current {"ok":true,...})
          // we keep awaiting until the server emits full telemetry.
          if (aliveRef.current) setData(null);
        }
      } catch (e: any) {
        if (!aliveRef.current) return;
        setErr(e?.message ?? "Witness fetch failed.");
      }
    };

    // Poll cadence: 1s feels “live” without being noisy.
    fetchTelemetry();
    const id = window.setInterval(fetchTelemetry, 1000);

    return () => {
      aliveRef.current = false;
      window.clearInterval(id);
    };
  }, []);

  if (err) {
    return <div className="glass-gate-placeholder">Witness offline: {err}</div>;
  }

  if (!data) {
    return <div className="glass-gate-placeholder">Awaiting Resonance...</div>;
  }

  return (
    <div className="glass-gate">
      <h3>Witness: Glass Gate Active</h3>

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
          <strong>Active Axioms:</strong>{" "}
          {data.active_axioms.length ? data.active_axioms.join(" · ") : "None"}
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
