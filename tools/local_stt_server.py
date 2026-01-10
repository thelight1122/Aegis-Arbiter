from __future__ import annotations

import os
import tempfile

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel

MODEL_NAME = os.getenv("AEGIS_STT_MODEL", "medium")
COMPUTE_TYPE = os.getenv("AEGIS_STT_COMPUTE", "int8")

app = FastAPI()
model = WhisperModel(MODEL_NAME, compute_type=COMPUTE_TYPE)


@app.post("/transcribe")
async def transcribe(request: Request):
  data = await request.body()
  if not data:
    return JSONResponse(status_code=400, content={"error": "Missing media bytes."})

  content_type = request.headers.get("content-type", "")
  suffix = ".webm" if "webm" in content_type else ".wav"
  with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
    tmp.write(data)
    tmp.flush()
    tmp_path = tmp.name

  try:
    segments, _info = model.transcribe(tmp_path)
    text = " ".join(segment.text.strip() for segment in segments).strip()
    return {"text": text}
  finally:
    try:
      os.remove(tmp_path)
    except OSError:
      pass
