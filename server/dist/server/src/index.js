// FILE: server/src/index.ts
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { runAegisCli } from "./cliRunner.js";
import { ArbiterOrchestrator } from "../../src/kernal/orchestrator.js";
import { TensorRepository } from "../../src/kernal/storage/tensorRepository.js";
import { ResonanceService } from "../../src/kernal/analysis/resonanceServices.js";
const app = express();
const dbPath = path.join(process.cwd(), "data", "aegis-kernel.sqlite");
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
// NOTE: This path assumes you're running the server with CWD=server/
// and that the schema lives at: ../src/kernal/storage/schema.sql
const schemaPath = path.join(process.cwd(), "..", "src", "kernal", "storage", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");
db.exec(schemaSql);
db.exec("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY);");
const tensorRepo = new TensorRepository(db);
const resonance = new ResonanceService(tensorRepo);
const orchestrator = new ArbiterOrchestrator(tensorRepo, resonance, db);
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
            analyze: "/api/analyze"
        },
        note: "This server is typically reverse-proxied. In Docker, the UI proxies /api/* to this service.",
        timestamp: new Date().toISOString()
    });
});
/**
 * Simple health endpoint (common convention)
 */
app.get("/health", (_req, res) => {
    res.status(200).json({
        ok: true,
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});
app.get("/api/ping", (_req, res) => {
    res.json({
        ok: true,
        status: "ready",
        detail: "In-process analyzer active (no external CLI required).",
        timestamp: new Date().toISOString()
    });
});
function buildSummary(json) {
    const mode = json?.mode ?? "rbc";
    const flagged = Boolean(json?.flagged);
    const total = json?.score?.total;
    const findingsCount = Array.isArray(json?.findings) ? json.findings.length : 0;
    const base = flagged
        ? `⚠️ ${findingsCount} findings (see details)`
        : `✅ No issues found`;
    return `${mode.toUpperCase()} ANALYSIS SUMMARY: ${base} (${total} total points)`;
}
// ...existing code...
//# sourceMappingURL=index.js.map