import type { TensorRepository } from "./storage/tensorRepository.js";
export declare class AegisKernel {
    private repo;
    constructor(repo: TensorRepository);
    /**
     * The core interaction loop.
     * Observe -> Map -> Ground.
     */
    processTurn(sessionId: string, input: string): Promise<any>;
}
