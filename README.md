# Name
### aegis-arbiter-ui

# Synopsis


# Description

# Local Transcription (Dev)
To enable audio/video capture during development, run the local transcription server:

```bash
python -m uvicorn tools.local_stt_server:app --host 0.0.0.0 --port 8000
```

Dependencies (Python):
`fastapi`, `uvicorn`, `faster-whisper`

Environment variables:
- `AEGIS_STT_URL` (server): defaults to `http://localhost:8000/transcribe`
- `AEGIS_STT_MODEL` (local STT): defaults to `medium`
- `AEGIS_STT_COMPUTE` (local STT): defaults to `int8`

# Example

# Install:
`npm install aegis-arbiter-ui`

# Test:
`npm test`

#License:
