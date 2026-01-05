-- /src/storage/sqlite/schema.sql

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Tracks schema migrations.
CREATE TABLE IF NOT EXISTS migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

-- Versioned axioms to prevent silent drift.
CREATE TABLE IF NOT EXISTS axiom_versions (
  version TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  label TEXT NOT NULL,
  content_json TEXT NOT NULL
);

-- Per-install and per-session settings that enforce Sovereignty.
-- NOTE: renamed column from "key" -> "setting_key" to avoid keyword collisions.
CREATE TABLE IF NOT EXISTS settings (
  setting_key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Sessions allow export/purge boundaries.
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  debug_unlocked INTEGER NOT NULL DEFAULT 0
);

-- Public audit log (safe, redacted, user-facing).
CREATE TABLE IF NOT EXISTS audit_public (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity INTEGER NOT NULL,
  axiom_tags TEXT NOT NULL,
  reason_codes TEXT NOT NULL,
  summary TEXT NOT NULL,
  details_json TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_public_session_time
ON audit_public(session_id, created_at);

-- Private trace log (deep debug). Only written when debug is unlocked.
CREATE TABLE IF NOT EXISTS audit_private (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity INTEGER NOT NULL,
  axiom_tags TEXT NOT NULL,
  reason_codes TEXT NOT NULL,
  summary TEXT NOT NULL,
  details_json TEXT NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_private_session_time
ON audit_private(session_id, created_at);

-- The Bookcase stores shelved loops/worries with explicit visibility and reversibility.
CREATE TABLE IF NOT EXISTS bookcase_items (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  label TEXT NOT NULL,
  content TEXT NOT NULL,
  unshelve_condition TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'SHELVED', -- SHELVED | UNSHELVED | PURGED
  unshelved_at TEXT,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookcase_session_status
ON bookcase_items(session_id, status);
