import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
export const db = new Database(join(__dir, 'devlisten.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id           TEXT PRIMARY KEY,
    title        TEXT DEFAULT 'Untitled Session',
    created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
    last_active  INTEGER NOT NULL DEFAULT (unixepoch()),
    msg_count    INTEGER NOT NULL DEFAULT 0,
    tags         TEXT DEFAULT '[]',
    total_ms     INTEGER NOT NULL DEFAULT 0,
    answer_count INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK(role IN ('user','assistant')),
    content     TEXT NOT NULL,
    tags        TEXT DEFAULT '[]',
    ms          INTEGER DEFAULT 0,
    rag_used    INTEGER DEFAULT 0,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS transcripts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    speaker     INTEGER NOT NULL DEFAULT 0,
    text        TEXT NOT NULL,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_msg_sess ON messages(session_id, created_at);
`);

const q = {
  createSession:   db.prepare(`INSERT INTO sessions (id, title) VALUES (?,?)`),
  getSession:      db.prepare(`SELECT * FROM sessions WHERE id=?`),
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

export const createSession   = (id, title) => q.createSession.run(id, title);
export const getSession      = (id) => q.getSession.get(id);
export const listSessions    = () => q.listSessions.all();
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
