import React, { useState, useEffect } from "react";
import { witnessEmitter } from "../witness.js";

interface TelemetryData {
    flow: { resonance: number; entropy: number };
    lens: { physical: number; emotional: number; mental: number; spiritual: number };
    tags: string[];
}

export default function PeerWidget({ onOpenOverlay }: { onOpenOverlay: () => void }) {
    const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const unsubscribe = witnessEmitter.on("resonance_event", (data: any) => {
            setTelemetry(data);
        });
        return () => unsubscribe();
    }, []);

    const resonance = telemetry?.flow.resonance ?? 0.5;
    const pulseScale = 1 + (resonance * 0.1);

    return (
        <div
            onClick={onOpenOverlay}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "fixed",
                bottom: 30,
                right: 30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 ${isHovered ? 20 : 10}px rgba(0, 153, 255, ${resonance})`,
                transform: `scale(${isHovered ? 1.15 : 1})`,
                zIndex: 1000
            }}
        >
            <div
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, #00d2ff 0%, #3a7bd5 100%)`,
                    boxShadow: `0 0 15px #00d2ff`,
                    transform: `scale(${pulseScale})`,
                    opacity: 0.9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: resonance > 0.7 ? "pulse 1s infinite alternate" : "none"
                }}
            >
                <span style={{ fontSize: 10, color: "white", fontWeight: "bold" }}>A</span>
            </div>

            <style>{`
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.7; }
          to { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
