-- AEGIS Kernel Storage: Tensor Persistence Logic
-- This file defines the resting state for the Mirror of Memory.

CREATE TABLE IF NOT EXISTS tensors (
  tensor_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  tensor_type TEXT NOT NULL, -- PT (Peer/Short-term) | ST (Spine/Long-term)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  data TEXT NOT NULL,
  drift_risk TEXT
);

-- Index for fast retrieval of historical resonance
CREATE INDEX IF NOT EXISTS idx_tensors_session_type_time
ON tensors(session_id, tensor_type, created_at);

-- Index for identifying patterns of AXIOM_3_FORCE or AXIOM_2_EXTREMES
CREATE INDEX IF NOT EXISTS idx_tensors_drift_risk
ON tensors(drift_risk);

-- Audit trail for alignment/system events
CREATE TABLE IF NOT EXISTS aegis_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  tensor_id TEXT,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_aegis_audit_log_session
ON aegis_audit_log(session_id, created_at);
