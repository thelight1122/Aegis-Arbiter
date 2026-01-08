import { TensorRepository } from "../../src/kernal/storage/tensorRepository.js";
/**
 * The Arbiter Controller coordinates two sovereign systems.
 * It fulfills AXIOM_1_BALANCE.
 */
export declare function arbiterMiddleware(repo: TensorRepository): (req: any, res: any) => Promise<any>;
