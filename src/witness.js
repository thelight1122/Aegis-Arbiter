// FILE: src/witness.ts
// Minimal event emitter for witness telemetry (Node + browser safe).
class WitnessEmitter {
    listeners = new Map();
    on(event, handler) {
        const set = this.listeners.get(event) ?? new Set();
        set.add(handler);
        this.listeners.set(event, set);
        return () => this.off(event, handler);
    }
    off(event, handler) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        set.delete(handler);
        if (set.size === 0)
            this.listeners.delete(event);
    }
    emit(event, payload) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        for (const handler of set)
            handler(payload);
    }
}
export const witnessEmitter = new WitnessEmitter();
