import { TensorRepository } from "../../src/kernal/storage/tensorRepository.js";
/**
 * The Ledger endpoint provides access to the Logic Spine.
 * It fulfills AXIOM_5_AWARENESS.
 */
export declare function ledgerMiddleware(repo: TensorRepository): (req: any, res: any) => Promise<void>;
