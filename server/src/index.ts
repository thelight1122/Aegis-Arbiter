// server/src/index.ts
import express from "express";
import cors from "cors";
import { runAegisCli } from "./cliRunner.js";
import { ArbiterOrchestrator } from "../../src/kernal/orchestrator.js";
import { TensorRepository } from "../../src/kernal/storage/tensorRepository.js";
import { ResonanceService } from "../../src/kernal/analysis/resonanceServices.js";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const app = express();

const dbPath = path.join(process.cwd(), "data", "aegis-kernel.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schemaPath = path.join(process.cwd(), "src", "kernal", "storage", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");
db.exec(schemaSql);
db.exec("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY);");

const tensorRepo = new TensorRepository(db);
const resonance = new ResonanceService(tensorRepo);
const orchestrator = new ArbiterOrchestrator(tensorRepo, resonance);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

/**
 * Root route (useful when reverse-proxied by nginx as /api -> /)
 * This prevents "Cannot GET /" confusion for testers/researchers.
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "aegis-arbiter-server",
    status: "online",
    routes: {
      ping: "/api/ping",
      analyze: "/api/analyze",
    },
    note:
      "This server is typically reverse-proxied. In Docker, the UI proxies /api/* to this service.",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Simple health endpoint (common convention)
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/ping", (_req, res) => {
  res.json({
    ok: true,
    status: "ready",
    detail: "In-process analyzer active (no external CLI required).",
    timestamp: new Date().toISOString(),
  });
});

function buildSummary(json: any): string {
  const mode = json?.mode ?? "rbc";
  const flagged = Boolean(json?.flagged);

  const total = json?.score?.total;
  const findingsCount = Array.isArray(json?.findings) ? json.findings.length : 0;

  const base = flagged ? "FLAGGED" : "CLEAN";
  const parts: string[] = [];

  parts.push(`${base} — ${mode} mode`);

  if (typeof total === "number") parts.push(`score=${total}`);
  parts.push(`findings=${findingsCount}`);

  return parts.join(" | ");
}

app.post("/api/analyze", async (req, res) => {
  const body = req.body ?? {};
  const mode = (body.mode ?? "rbc") as "rbc" | "arbiter" | "lint";
  const prompt = (body.prompt ?? "").toString();
  const notepad = (body.notepad ?? "").toString();
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const text = typeof body.text === "string" ? body.text : "";

  const start = Date.now();

  try {
    if (sessionId && text) {
      db.prepare("INSERT OR IGNORE INTO sessions (id) VALUES (?)").run(sessionId);

      const result = await orchestrator.process(sessionId, text);

      if (result.status === "fractured") {
        return res.json({
          ...result,
          pause_triggered: true,
          notice: "System has initiated a Self-Care Pause. State archived to Bookcase."
        });
      }

      return res.json(result);
    }

    const json = await runAegisCli({ mode, prompt, notepad });

    res.json({
      ok: true,
      mode,
      summary: buildSummary(json),
      json,
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - start,
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      mode,
      summary: "Failed to run in-process analyzer.",
      json: { error: err?.message ?? String(err) },
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - start,
    });
  }
});

const port = Number(process.env.PORT ?? 8787);

/**
 * IMPORTANT for Docker: bind to 0.0.0.0, not localhost.
 * This ensures other containers (nginx) can reach the API service.
 */
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`[aegis-arbiter-server] listening on http://0.0.0.0:${port}`);
});
