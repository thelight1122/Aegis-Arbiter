/**
 * Manual Test Script for Aegis Core Logic Engine
 * Run with: npx ts-node src/core-engine/test-logic.ts
 */

import { CoreEngine } from "./CoreEngine.js";
import { IntegrityLens } from "./lenses/IntegrityLens.js";
import { ConvergenceLens } from "./lenses/ConvergenceLens.js";
import { ResonanceLens } from "./lenses/ResonanceLens.js";
import { LogicInput } from "./interfaces.js";

async function runTest() {
    console.log("=== Initializing Core Engine ===");
    const engine = new CoreEngine();

    engine.registerLens(new IntegrityLens());
    engine.registerLens(new ConvergenceLens());
    engine.registerLens(new ResonanceLens());

    console.log("=== Test 1: High Integrity Input (Flow) ===");
    const inputFlow: LogicInput = {
        content: "I believe that consistent architecture improves maintainability.",
        context: {
            agent_id: "test-user",
            session_id: "1",
            timestamp: new Date().toISOString(),
            scope: "SHARED",
            mode: "FLOW"
        }
    };
    const resFlow = await engine.evaluate(inputFlow);
    console.log("Result (Should be FLOW):", resFlow.status);
    console.log("Synthesis:", resFlow.synthesis);
    console.log("-----------------------------------------");

    console.log("=== Test 2: Absolute Metaphysical Claim (Flag) ===");
    const inputFlag: LogicInput = {
        content: "The Source is undeniably real and controls all sockets.",
        context: {
            agent_id: "test-user",
            session_id: "2",
            timestamp: new Date().toISOString(),
            scope: "SHARED", // triggers check
            mode: "FLOW"
        }
    };
    const resFlag = await engine.evaluate(inputFlag);
    console.log("Result (Should be FLAG/PAUSE):", resFlag.status);
    console.log("Synthesis:", resFlag.synthesis);
    console.log("-----------------------------------------");

    console.log("=== Test 3: Convergence Friction (Flag) ===");
    const inputConv: LogicInput = {
        context: { agent_id: "test", session_id: "3", timestamp: "", scope: "SHARED" },
        // Mock Tensor objects
        tensorState: { emotional: 0.8, mental: 0.5 } as any,
        comparisonTensorState: { emotional: 0.2, mental: 0.5 } as any
    };
    const resConv = await engine.evaluate(inputConv);
    // Abs(0.8 - 0.2) = 0.6 (> 0.5 Threshold) -> FRICTION/FLAG
    console.log("Result (Should be FLAG):", resConv.status);
    console.log("Synthesis:", resConv.synthesis);
    console.log("-----------------------------------------");
}

runTest().catch(console.error);
