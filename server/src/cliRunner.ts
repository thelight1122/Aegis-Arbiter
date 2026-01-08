// server/src/cliRunner.ts
import type { Analysis } from "./analyzer.js";
import { analyzeText } from "./analyzeText.js";

type RunCliInput = {
  mode: "rbc" | "arbiter" | "lint";
  prompt: string;
  notepad: string;
};

function composeInput(prompt: string, notepad: string): string {
  const p = (prompt ?? "").toString();
  const n = (notepad ?? "").toString();
  return `PROMPT:\n${p}\n\nNOTEPAD:\n${n}\n`;
}

function mapMode(mode: RunCliInput["mode"]): { rbc: boolean; arbiter: boolean; lint: boolean } {
  if (mode === "arbiter") return { rbc: false, arbiter: true, lint: false };
  if (mode === "lint") return { rbc: false, arbiter: false, lint: true };
  return { rbc: true, arbiter: false, lint: false };
}

export async function runAegisCli(input: RunCliInput): Promise<Analysis> {
  const text = composeInput(input.prompt, input.notepad);
  const flags = mapMode(input.mode);
  return analyzeText(text);
}
