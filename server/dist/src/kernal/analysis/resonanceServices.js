function clamp01(n) {
    if (!Number.isFinite(n))
        return 0;
    return Math.min(Math.max(n, 0), 1);
}
export class ResonanceService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    /**
     * Calculates the delta between the current tensor and the recent Spine (ST).
     * This is a measurement utility, not a truth engine.
     */
    getAlignmentSnapshot(sessionId, current, limit = 5) {
        const spine = this.repo.getSpine(sessionId, limit);
        const drift = clamp01(current?.state?.axes?.drift_risk ?? 0);
        // Coherence is optional depending on your PT/ST modeling.
        // If absent, we treat it as 0.5 (neutral) rather than risking NaN.
        const currentCoherence = clamp01(current?.state?.axes?.coherence_score ?? 0.5);
        let baseline_used = false;
        // Average coherence of recent STs (ordered by created_at desc in repo)
        const st = spine.filter((t) => t.tensor_type === "ST");
        let spineCoherence = 0.8;
        if (st.length > 0) {
            const sum = st.reduce((acc, t) => acc + clamp01(t?.state?.axes?.coherence_score ?? 0), 0);
            spineCoherence = clamp01(sum / st.length);
        }
        else {
            baseline_used = true;
        }
        // Delta = difference from spine coherence + drift pressure.
        const delta = clamp01(Math.abs(currentCoherence - spineCoherence) + drift);
        // Status thresholds (configurable later)
        let status = "stable";
        if (delta > 0.4)
            status = "drifting";
        if (delta > 0.7)
            status = "fractured";
        // We do NOT "detect" axioms here; we can recommend tags conservatively.
        // Use only tags already present on the tensor (canon-filtered upstream).
        const suggestedTags = Array.isArray(current?.state?.labels?.axiom_tags)
            ? current.state.labels.axiom_tags
            : [];
        return {
            equilibrium_delta: delta,
            resonance_status: status,
            baseline_used,
            drivers: {
                drift_risk: drift,
                spine_coherence: spineCoherence,
                current_coherence: currentCoherence
            },
            suggested_axiom_tags: suggestedTags
        };
    }
}
