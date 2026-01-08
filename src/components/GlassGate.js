import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
    return (_jsxs("div", { style: { padding: '20px', background: '#f4f4f4', borderRadius: '8px' }, children: [_jsx("h3", { children: "Witness Stream: Glass Gate Active" }), _jsxs("div", { className: "meters", children: [_jsx(Meter, { label: "Mental (Logic)", value: data.lenses.mental }), _jsx(Meter, { label: "Emotional (Resonance)", value: data.lenses.emotional }), _jsx(Meter, { label: "Physical (Resources)", value: data.lenses.physical }), _jsx(Meter, { label: "Spiritual (Identity)", value: data.lenses.spiritual })] }), _jsxs("div", { className: "status", style: { marginTop: '20px' }, children: [_jsxs("p", { children: [_jsx("strong", { children: "ECU Tension:" }), " ", (data.tension * 100).toFixed(0), "%"] }), _jsxs("p", { children: [_jsx("strong", { children: "Active Axioms:" }), " ", data.active_axioms.join(' · ') || 'None'] }), _jsxs("p", { children: [_jsx("strong", { children: "Flow Energy:" }), " ", data.flow_energy.toFixed(2)] })] })] }));
};
const Meter = ({ label, value }) => (_jsxs("div", { style: { marginBottom: '10px' }, children: [_jsxs("label", { children: [label, ": "] }), _jsx("div", { style: { width: '100%', background: '#ddd', height: '10px' }, children: _jsx("div", { style: {
                    width: `${value * 100}%`,
                    background: value < 0.4 ? '#ffcc00' : '#444',
                    height: '100%',
                    transition: 'width 0.3s ease'
                } }) })] }));
