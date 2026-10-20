import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "app.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS identities (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  dept TEXT NOT NULL,
  place TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY,
  identity_id INTEGER NOT NULL REFERENCES identities(id),
  pin TEXT NOT NULL,
  complaint_text TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  voice TEXT NOT NULL CHECK (voice IN ('relative','meme')),
  wall_status TEXT NOT NULL DEFAULT 'none' CHECK (wall_status IN ('none','pending','approved','rejected')),
  is_seed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS complaints_wall ON complaints(wall_status, id);
CREATE TABLE IF NOT EXISTS memes (
  id INTEGER PRIMARY KEY,
  phrase TEXT NOT NULL UNIQUE,
  note TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  added_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

// one connection per server process (survives dev hot reload)
const g = globalThis as unknown as { __db?: Database.Database };

export function getDb(): Database.Database {
  if (!g.__db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.exec(SCHEMA);
    g.__db = db;
  }
  return g.__db;
}
