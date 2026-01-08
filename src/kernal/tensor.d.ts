export type TensorType = "PT" | "ST";
export interface AegisTensor {
    tensor_id: string;
    tensor_type: TensorType;
    version: "1.0.0";
    created_at: string;
    updated_at?: string;
    source: {
        channel: "user" | "assistant" | "system" | "tool" | "external";
        thread_id?: string;
        turn_id?: string;
    };
    state: {
        payload: {
            text?: string;
            summary?: string;
            hash?: string;
        };
        axes: {
            temporal_proximity?: number;
            context_scope: "moment" | "task" | "conversation" | "project";
            salience_weight?: number;
            drift_risk?: number;
            coherence_score?: number;
            resonance_index?: number;
        };
        labels: {
            axiom_tags: string[];
            origin_integrity: "observed" | "derived" | "corrected" | "uncertain";
            confidence: number;
        };
    };
    lifecycle: {
        ttl_seconds: number;
        decay_rate: number;
        pinned: boolean;
    };
}
//# sourceMappingURL=tensor.d.ts.map