import React, { useState, useEffect } from "react";
import { witnessEmitter } from "../witness.js";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function PeerOverlay({ isOpen, onClose }: Props) {
    const [telemetry, setTelemetry] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = witnessEmitter.on("resonance_event", (data: any) => {
            setTelemetry(data);
        });
        return () => unsubscribe();
    }, []);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100dvw",
                height: "100dvh",
                background: "rgba(3, 7, 18, 0.92)",
                backdropFilter: "blur(40px) saturate(180%)",
                zIndex: 2000,
                display: "flex",
                flexDirection: "column",
                color: "#f8fafc",
                padding: "40px",
                fontFamily: "'Inter', sans-serif"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Mirror of Memory</h1>
                    <p style={{ margin: "8px 0 0 0", opacity: 0.6 }}>Sovereign Participant Alignment Interface</p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        padding: "12px 24px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s"
                    }}
                >
                    Close Prism
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30, flex: 1 }}>
                {/* PARALLEL LEDGERS */}
                <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24 }}>
                    <h2 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#38bdf8" }}>◈</span> 4-Body Ledgers
                    </h2>
                    <div style={{ display: "grid", gap: 16 }}>
                        {["Physical", "Emotional", "Mental", "Spiritual"].map(l => (
                            <div key={l} style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.02)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontWeight: 600, opacity: 0.8 }}>{l}</span>
                                    <span style={{ fontSize: "0.9rem", color: "#38bdf8" }}>{((telemetry?.lens?.[l.toLowerCase()] ?? 0.5) * 100).toFixed(0)}%</span>
                                </div>
                                <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                                    <div style={{ width: `${(telemetry?.lens?.[l.toLowerCase()] ?? 0.5) * 100}%`, height: "100%", background: "#38bdf8", borderRadius: 2, transition: "width 0.5s" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DATAQUAD STATUS */}
                <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24 }}>
                    <h2 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#fbbf24" }}>◈</span> DataQuad Persistence
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {["PEER", "PCT", "NCT", "SPINE"].map(q => (
                            <div key={q} style={{ padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 20, textAlign: "center", border: "1px solid rgba(255,255,255,0.02)" }}>
                                <div style={{ fontSize: "0.8rem", opacity: 0.4, marginBottom: 8 }}>{q}</div>
                                <div style={{ fontWeight: 800, color: "#fbbf24" }}>ACTIVE</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 24, padding: 20, background: "rgba(251, 191, 36, 0.05)", border: "1px solid rgba(251, 191, 36, 0.15)", borderRadius: 20 }}>
                        <div style={{ fontSize: "0.9rem", color: "#fbbf24", marginBottom: 8, fontWeight: 700 }}>Logic Spine Status</div>
                        <div style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: 1.5 }}>
                            Continuity maintained across 12 turns. Resonance delta stable at 0.12.
                        </div>
                    </div>
                </section>

                {/* TELEMETRY FEED */}
                <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "1.1rem", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#f472b6" }}>◈</span> Resonance Stream
                    </h2>
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column-reverse", gap: 12 }}>
                        {telemetry?.tags?.map((t: string, i: number) => (
                            <div key={i} style={{ padding: "8px 16px", background: "rgba(244, 114, 182, 0.1)", border: "1px solid rgba(244, 114, 182, 0.2)", borderRadius: 10, fontSize: "0.85rem", color: "#f472b6" }}>
                                {t}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div style={{ marginTop: 40, textAlign: "center", opacity: 0.4, fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                AEGIS KERNEL 2.0 • PROTOCOL OF NON-COERCION
            </div>
        </div>
    );
}
