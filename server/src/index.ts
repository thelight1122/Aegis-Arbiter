import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import type { AnalyzeRequest, AnalyzeResponse, PingResponse } from "./types.js";
import { runAegisCli } from "./cliRunner.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/ping", (_req: Request, res: Response) => {
  const payload: PingResponse = {
    ok: true,
    status: "ready",
    detail: process.env.AEGIS_CLI_PATH ? "CLI configured" : "CLI path not set (using default dist/cli.js)",
    timestamp: new Date().toISOString()
  };
  res.json(payload);
});

app.post("/api/analyze", async (req: Request, res: Response) => {
  const body = req.body as Partial<AnalyzeRequest>;

  const mode = body.mode ?? "rbc";
  const prompt = (body.prompt ?? "").toString();
  const notepad = (body.notepad ?? "").toString();

  const start = Date.now();

  try {
    const json = await runAegisCli({ mode, prompt, notepad });

    const out: AnalyzeResponse = {
      ok: true,
      mode,
      summary: `OK — processed in ${Date.now() - start}ms (via CLI).`,
      json,
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - start
    };

    res.json(out);
  } catch (err: any) {
    const out: AnalyzeResponse = {
      ok: false,
      mode,
      summary: "Failed to run CLI.",
      json: { error: err?.message ?? String(err) },
      timestamp: new Date().toISOString(),
      elapsed_ms: Date.now() - start
    };

    res.status(500).json(out);
  }
});

const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[aegis-arbiter-server] listening on http://localhost:${port}`);
});
