import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import './GlassGate.css';
/**
 * The GlassGate component acts as a passive observer.
 * It fulfills AXIOM_5_AWARENESS.
 */
export const GlassGate = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        // Establish the Witness connection to the Kernel
        const eventSource = new EventSource('/api/witness');
        eventSource.onmessage = (event) => {
            const telemetry = JSON.parse(event.data);
            setData(telemetry);
        };
        return () => eventSource.close(); // Honor AXIOM_6_CHOICE (Disconnect)
    }, []);
    if (!data)
        return _jsx("div", { children: "Awaiting Resonance..." });
    return (_jsxs("div", { className: "glass-gate", children: [_jsx("h3", { children: "Witness Stream: Glass Gate Active" }), _jsxs("div", { className: "meters", children: [_jsx(Meter, { label: "Mental (Logic)", value: data.lenses.mental }), _jsx(Meter, { label: "Emotional (Resonance)", value: data.lenses.emotional }), _jsx(Meter, { label: "Physical (Resources)", value: data.lenses.physical }), _jsx(Meter, { label: "Spiritual (Identity)", value: data.lenses.spiritual })] }), _jsxs("div", { className: "status", children: [_jsxs("p", { children: [_jsx("strong", { children: "ECU Tension:" }), " ", (data.tension * 100).toFixed(0), "%"] }), _jsxs("p", { children: [_jsx("strong", { children: "Active Axioms:" }), " ", data.active_axioms.join(' · ') || 'None'] }), _jsxs("p", { children: [_jsx("strong", { children: "Flow Energy:" }), " ", data.flow_energy.toFixed(2)] })] })] }));
};
const Meter = ({ label, value }) => {
    const isWarning = value < 0.4;
    return (_jsxs("div", { className: "meter", children: [_jsxs("label", { children: [label, ": "] }), _jsx("meter", { min: 0, max: 1, value: value, className: `meter-bar${isWarning ? ' meter-bar--warning' : ''}` })] }));
};
