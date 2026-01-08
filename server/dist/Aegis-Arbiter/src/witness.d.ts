type WitnessHandler = (payload: unknown) => void;
declare class WitnessEmitter {
    private listeners;
    on(event: string, handler: WitnessHandler): () => void;
    off(event: string, handler: WitnessHandler): void;
    emit(event: string, payload: unknown): void;
}
export declare const witnessEmitter: WitnessEmitter;
export {};
