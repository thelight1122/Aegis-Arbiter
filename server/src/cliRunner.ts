import { spawn } from "node:child_process";

type RunCliInput = {
  mode: "rbc" | "arbiter" | "lint";
  prompt: string;
  notepad: string;
};

function parseJsonLoose(stdout: string): unknown {
  // CLI might print extra lines. We try:
  // 1) direct JSON parse
  // 2) locate first "{" and last "}" and parse substring
  const s = stdout.trim();
  try {
    return JSON.parse(s);
  } catch {}

  const i = s.indexOf("{");
  const j = s.lastIndexOf("}");
  if (i >= 0 && j > i) {
    const sub = s.slice(i, j + 1);
    try {
      return JSON.parse(sub);
    } catch {}
  }

  return { raw: stdout };
}

export async function runAegisCli(input: RunCliInput): Promise<unknown> {
  // Point this at your real built CLI.
  // Example:
  //   AEGIS_CLI_PATH=dist/cli.js
  //   AEGIS_CWD=/absolute/path/to/aegis-arbiter
  const cliPath = process.env.AEGIS_CLI_PATH ?? "dist/cli.js";
  const cwd = process.env.AEGIS_CWD ?? process.cwd();

  // Mode mapping to your CLI flags (adjust if your CLI uses different flags)
  const modeFlag =
    input.mode === "rbc" ? "--rbc" :
    input.mode === "arbiter" ? "--arbiter" :
    "--lint";

  // We pass combined text via stdin (simple, robust)
  const stdinPayload =
    `PROMPT:\n${input.prompt}\n\nNOTEPAD:\n${input.notepad}\n`;

  const args = [
    cliPath,
    modeFlag,
    "--out",
    "telemetry"
  ];

  // Run as: node dist/cli.js --rbc --out telemetry
  const child = spawn(process.execPath, args, {
    cwd,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr?.on('data', (data) => {
    stderr += data.toString();
  });

  child.stdin?.write(stdinPayload);
  child.stdin?.end();

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve(parseJsonLoose(stdout));
      } else {
        reject(new Error(`CLI failed: ${stderr}`));
      }
    });

    child.on('error', reject);
  });
}
