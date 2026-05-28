import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
// In production / Docker, point to the persistent-volume path. Locally,
// default to the file in the project dir.
const DB_PATH = process.env.DATABASE_PATH || join(__dir, 'devlisten.db');
export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema bootstrap — each DDL statement via prepare(...).run() for
// consistency with security-tooling expectations. Migrations are idempotent.
db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  title        TEXT DEFAULT 'Untitled Session',
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  last_active  INTEGER NOT NULL DEFAULT (unixepoch()),
  msg_count    INTEGER NOT NULL DEFAULT 0,
  tags         TEXT DEFAULT '[]',
  total_ms     INTEGER NOT NULL DEFAULT 0,
  answer_count INTEGER NOT NULL DEFAULT 0,
  user_id      INTEGER REFERENCES users(id)
)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`).run();

// Idempotent migration: add user_id to legacy sessions tables. ALTER fails
// silently when the column already exists — caught and ignored. Required for
// the multi-tenant isolation that gates session ownership.
try {
  db.prepare(`ALTER TABLE sessions ADD COLUMN user_id INTEGER REFERENCES users(id)`).run();
} catch (_) {
  /* column already present — fine */
}

db.prepare(`CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK(role IN ('user','assistant')),
  content     TEXT NOT NULL,
  tags        TEXT DEFAULT '[]',
  ms          INTEGER DEFAULT 0,
  rag_used    INTEGER DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS transcripts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  speaker     INTEGER NOT NULL DEFAULT 0,
  text        TEXT NOT NULL,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
)`).run();

db.prepare(`CREATE INDEX IF NOT EXISTS idx_msg_sess ON messages(session_id, created_at)`).run();

// Audit log — append-only record of sensitive actions for incident response.
// Stores who did what when, IP + user-agent for forensic correlation.
db.prepare(`CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER,
  action      TEXT NOT NULL,
  metadata    TEXT,
  ip          TEXT,
  ua          TEXT,
  at          INTEGER NOT NULL DEFAULT (unixepoch())
)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_audit_user_at ON audit_log(user_id, at)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_audit_action_at ON audit_log(action, at)`).run();

// Abuse reports — both user-initiated in-app reports and anonymous public
// reports via /landing/report.html land here. DMCA notices use kind='dmca'
// and require structured payload. Admin queue lives at GET /api/admin/abuse-queue.
db.prepare(`CREATE TABLE IF NOT EXISTS abuse_reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  kind          TEXT NOT NULL DEFAULT 'abuse', -- 'abuse' | 'dmca'
  reporter_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reporter_email TEXT, -- for anonymous reports
  content_type  TEXT NOT NULL,  -- 'doc' | 'transcript' | 'session' | 'message' | 'other'
  content_id    TEXT NOT NULL,
  reason        TEXT NOT NULL,
  details       TEXT,
  payload       TEXT, -- JSON blob for DMCA's structured fields
  status        TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'dismissed' | 'removed'
  reviewed_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at   INTEGER,
  ip            TEXT,
  ua            TEXT,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch())
)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_abuse_status_created ON abuse_reports(status, created_at)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_abuse_kind_status ON abuse_reports(kind, status)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_abuse_content ON abuse_reports(content_type, content_id)`).run();

// Soft-delete column for docs so admin removals are reversible.
try {
  db.prepare(`ALTER TABLE docs ADD COLUMN removed_at INTEGER`).run();
} catch (e) {
  if (!/duplicate column/i.test(e.message)) {
    console.error("docs.removed_at migration:", e.message);
  }
}
db.prepare(`CREATE INDEX IF NOT EXISTS idx_docs_removed_at ON docs(removed_at)`).run();

export function writeAuditLog(userId, action, metadata = null, req = null) {
  try {
    const ip =
      req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req?.ip ||
      req?.socket?.remoteAddress ||
      null;
    const ua = req?.headers?.["user-agent"] || null;
    db.prepare(
      "INSERT INTO audit_log (user_id, action, metadata, ip, ua) VALUES (?, ?, ?, ?, ?)",
    ).run(
      userId || null,
      action,
      metadata ? JSON.stringify(metadata) : null,
      ip,
      ua,
    );
  } catch (e) {
    // Never let audit-log failures break a request.
    console.error("audit_log write failed:", e.message);
  }
}

const q = {
  createSession:   db.prepare(`INSERT INTO sessions (id, title, user_id) VALUES (?,?,?)`),
  getSession:      db.prepare(`SELECT * FROM sessions WHERE id=?`),
  // Ownership-scoped variants — use these for any cross-user accessible route.
  getSessionForUser: db.prepare(`SELECT * FROM sessions WHERE id=? AND user_id=?`),
  listSessionsForUser: db.prepare(`SELECT * FROM sessions WHERE user_id=? ORDER BY last_active DESC LIMIT 100`),
  listSessions:    db.prepare(`SELECT * FROM sessions ORDER BY last_active DESC LIMIT 100`),
  updateTitle:     db.prepare(`UPDATE sessions SET title=? WHERE id=?`),
  updateTags:      db.prepare(`UPDATE sessions SET tags=? WHERE id=?`),
  touchSession:    db.prepare(`UPDATE sessions SET last_active=unixepoch() WHERE id=?`),
  bumpStats:       db.prepare(`UPDATE sessions SET msg_count=msg_count+1, answer_count=answer_count+1, total_ms=total_ms+?, last_active=unixepoch() WHERE id=?`),
  deleteSession:   db.prepare(`DELETE FROM sessions WHERE id=?`),
  addMessage:      db.prepare(`INSERT INTO messages (session_id,role,content,tags,ms,rag_used) VALUES (?,?,?,?,?,?)`),
  getMessages:     db.prepare(`SELECT role,content FROM messages WHERE session_id=? ORDER BY created_at ASC`),
  getFullMessages: db.prepare(`SELECT * FROM messages WHERE session_id=? ORDER BY created_at ASC`),
  getRecentMsgs:   db.prepare(`SELECT role,content FROM messages WHERE session_id=? ORDER BY created_at DESC LIMIT ?`),
  addTranscript:   db.prepare(`INSERT INTO transcripts (session_id,speaker,text) VALUES (?,?,?)`),
  getTranscripts:  db.prepare(`SELECT * FROM transcripts WHERE session_id=? ORDER BY created_at ASC`),
  getSessionStats: db.prepare(`
    SELECT
      s.answer_count,
      s.total_ms,
      s.msg_count,
      s.created_at,
      s.last_active,
      s.tags,
      COUNT(DISTINCT json_each.value) as unique_tags
    FROM sessions s
    LEFT JOIN json_each(s.tags)
    WHERE s.id=?
    GROUP BY s.id
  `),
};

// Session creation now records the owning user_id. Legacy callers passing
// only (id, title) are still supported but the resulting session will be
// orphan — those rows can't pass ownership checks. New code must pass userId.
export const createSession   = (id, title, userId = null) => q.createSession.run(id, title, userId);
export const getSession      = (id) => q.getSession.get(id);
export const getSessionForUser = (id, userId) => q.getSessionForUser.get(id, userId);
export const listSessions    = () => q.listSessions.all();
export const listSessionsForUser = (userId) => q.listSessionsForUser.all(userId);
export const updateSessionTitle = (id, title) => q.updateTitle.run(title, id);
export const deleteSession   = (id) => q.deleteSession.run(id);
export const touchSession    = (id) => q.touchSession.run(id);

export function addMessage(sessionId, role, content, tags=[], ms=0, ragUsed=false) {
  q.addMessage.run(sessionId, role, content, JSON.stringify(tags), ms, ragUsed?1:0);
  if (role === 'assistant') q.bumpStats.run(ms, sessionId);
  else db.prepare(`UPDATE sessions SET msg_count=msg_count+1, last_active=unixepoch() WHERE id=?`).run(sessionId);
}

export const getMessages     = (id, limit=null) =>
  limit ? q.getRecentMsgs.all(id, limit*2).reverse() : q.getMessages.all(id);
export const getFullMessages = (id) => q.getFullMessages.all(id);
export const addTranscript   = (id, speaker, text) => q.addTranscript.run(id, speaker, text);
export const getTranscripts  = (id) => q.getTranscripts.all(id);
export const getSessionStats = (id) => q.getSessionStats.get(id);

export function updateSessionTags(id, tags) {
  q.updateTags.run(JSON.stringify(tags), id);
}

export function searchMessages(sessionId, keyword) {
  return db.prepare(`
    SELECT content, created_at, role FROM messages
    WHERE session_id=? AND content LIKE ? ORDER BY created_at DESC LIMIT 8
  `).all(sessionId, `%${keyword}%`);
}
