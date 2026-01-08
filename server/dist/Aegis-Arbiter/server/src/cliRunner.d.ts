import type { Analysis } from "./analyzer.js";
type RunCliInput = {
    mode: "rbc" | "arbiter" | "lint";
    prompt: string;
    notepad: string;
};
export declare function runAegisCli(input: RunCliInput): Promise<Analysis>;
export {};
