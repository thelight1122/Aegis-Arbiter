-- /src/storage/sqlite/schema.sql

-- Note: Converted to SQL Server syntax. Original PRAGMA statements removed as they are SQLite-specific.
-- Enable foreign keys (SQL Server equivalent via ALTER TABLE or constraints).
-- For WAL mode, consider using FULL recovery model if needed.

-- Tracks schema migrations.
IF OBJECT_ID('migrations', 'U') IS NULL
CREATE TABLE migrations (
  id NVARCHAR(255) PRIMARY KEY,
  applied_at NVARCHAR(255) NOT NULL
);

-- Versioned axioms to prevent silent drift.
IF OBJECT_ID('axiom_versions', 'U') IS NULL
CREATE TABLE axiom_versions (
  version NVARCHAR(255) PRIMARY KEY,
  created_at NVARCHAR(255) NOT NULL,
  label NVARCHAR(255) NOT NULL,
  content_json NVARCHAR(MAX) NOT NULL
);

-- Per-install and per-session settings that enforce Sovereignty.
IF OBJECT_ID('settings', 'U') IS NULL
CREATE TABLE settings (
  [key] NVARCHAR(255) PRIMARY KEY,
  value_json NVARCHAR(MAX) NOT NULL,
  updated_at NVARCHAR(255) NOT NULL
);

-- Sessions allow export/purge boundaries.
IF OBJECT_ID('sessions', 'U') IS NULL
CREATE TABLE sessions (
  id NVARCHAR(255) PRIMARY KEY,
  created_at NVARCHAR(255) NOT NULL,
  last_seen_at NVARCHAR(255) NOT NULL,
  debug_unlocked INT NOT NULL DEFAULT 0
);

-- Public audit log (safe, redacted, user-facing).
IF OBJECT_ID('audit_public', 'U') IS NULL
CREATE TABLE audit_public (
  id NVARCHAR(255) PRIMARY KEY,
  session_id NVARCHAR(255) NOT NULL,
  created_at NVARCHAR(255) NOT NULL,
  event_type NVARCHAR(255) NOT NULL,
  severity INT NOT NULL,
  axiom_tags NVARCHAR(MAX) NOT NULL,
  reason_codes NVARCHAR(MAX) NOT NULL,
  summary NVARCHAR(MAX) NOT NULL,
  details_json NVARCHAR(MAX) NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_audit_public_session_time')
CREATE INDEX idx_audit_public_session_time
ON audit_public(session_id, created_at);

-- Private trace log (deep debug). Only written when debug is unlocked.
IF OBJECT_ID('audit_private', 'U') IS NULL
CREATE TABLE audit_private (
  id NVARCHAR(255) PRIMARY KEY,
  session_id NVARCHAR(255) NOT NULL,
  created_at NVARCHAR(255) NOT NULL,
  event_type NVARCHAR(255) NOT NULL,
  severity INT NOT NULL,
  axiom_tags NVARCHAR(MAX) NOT NULL,
  reason_codes NVARCHAR(MAX) NOT NULL,
  summary NVARCHAR(MAX) NOT NULL,
  details_json NVARCHAR(MAX) NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_audit_private_session_time')
CREATE INDEX idx_audit_private_session_time
ON audit_private(session_id, created_at);

-- The Bookcase stores shelved loops/worries with explicit visibility and reversibility.
IF OBJECT_ID('bookcase_items', 'U') IS NULL
CREATE TABLE bookcase_items (
  id NVARCHAR(255) PRIMARY KEY,
  session_id NVARCHAR(255) NOT NULL,
  created_at NVARCHAR(255) NOT NULL,
  label NVARCHAR(255) NOT NULL,
  content NVARCHAR(MAX) NOT NULL,
  unshelve_condition NVARCHAR(MAX) NOT NULL DEFAULT '',
  status NVARCHAR(255) NOT NULL DEFAULT 'SHELVED', -- SHELVED | UNSHELVED | PURGED
  unshelved_at NVARCHAR(255),
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_bookcase_session_status')
CREATE INDEX idx_bookcase_session_status
ON bookcase_items(session_id, status);
