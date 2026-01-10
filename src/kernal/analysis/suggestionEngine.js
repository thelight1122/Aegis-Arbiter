function uniqueStrings(items) {
    return Array.from(new Set(items.filter((s) => typeof s === "string" && s.length > 0)));
}
export class SuggestionEngine {
    /**
     * Generates an IDS response block based on resonance analysis.
     * This is option-framed and canon-bound (AXIOM_1..AXIOM_6 only).
     */
    static generate(current, snapshot) {
        const tags = uniqueStrings(snapshot.suggested_axiom_tags ?? []);
        const tagText = tags.length > 0 ? tags.join(", ") : "uncertain";
        const identifyPrefix = snapshot.resonance_status === "aligned"
            ? "Observed alignment: stable"
            : `Observed alignment shift: ${snapshot.resonance_status}`;
        const identify = `${identifyPrefix}. ` +
            `Delta=${snapshot.equilibrium_delta.toFixed(2)} ` +
            `(drift=${snapshot.drivers.drift_risk.toFixed(2)}, ` +
            `spine=${snapshot.drivers.spine_coherence.toFixed(2)}, ` +
            `current=${snapshot.drivers.current_coherence.toFixed(2)})` +
            (snapshot.baseline_used ? " [baseline_used]" : "") +
            ".";
        // Keep DEFINE grounded and avoid invented canon.
        // We can reference the locked axioms by name if you’re using those tag strings.
        const define = snapshot.resonance_status === "aligned"
            ? `The peer signal is tracking with the recent spine (AXIOM_1_BALANCE). ` +
                `Maintain awareness (AXIOM_5_AWARENESS) and choice framing (AXIOM_6_CHOICE) to keep flow stable. ` +
                `Current tags: ${tagText}.`
            : `This pattern suggests reduced equilibrium relative to the recent spine (AXIOM_1_BALANCE). ` +
                `When delta rises, perspective can narrow (AXIOM_2_EXTREMES) and forceful phrasing can increase resistance (AXIOM_3_FORCE). ` +
                `Current tags: ${tagText}.`;
        const suggest = [
            // Option framing, non-coercive.
            "Option: Restate your intent in one sentence, then add one neutral observation (AXIOM_5_AWARENESS).",
            "Option: Offer two choices for next step (e.g., 'Do you want A or B?') to widen agency (AXIOM_6_CHOICE).",
            "Option: Replace pressure phrases with observation language to reduce resistance and invite flow (AXIOM_4_FLOW)."
        ];
        return { identify, define, suggest };
    }
}
