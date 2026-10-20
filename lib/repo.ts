// All SQL lives here.
import { getDb } from "./db";
import type { Meme, Voice } from "./prompts";

export type Identity = { id: number; title: string; dept: string; place: string };
export type WallStatus = "none" | "pending" | "approved" | "rejected";
export type WallPost = {
  id: number; complaint: string; reply: string; voice: Voice; pin: string; createdAt: string;
  identity: { title: string; dept: string; place: string };
};

export function randomIdentity(): Identity | undefined {
  return getDb().prepare("SELECT id, title, dept, place FROM identities ORDER BY RANDOM() LIMIT 1").get() as Identity | undefined;
}

export function identityExists(id: number): boolean {
  return !!getDb().prepare("SELECT 1 FROM identities WHERE id = ?").get(id);
}

export function randomApprovedMemes(n: number): Meme[] {
  return getDb().prepare("SELECT phrase, note FROM memes WHERE status = 'approved' ORDER BY RANDOM() LIMIT ?").all(n) as Meme[];
}

export function approvedMemeCount(): number {
  return (getDb().prepare("SELECT COUNT(*) n FROM memes WHERE status = 'approved'").get() as { n: number }).n;
}

export function insertComplaint(c: { identityId: number; pin: string; complaint: string; reply: string; voice: Voice }): number {
  const r = getDb()
    .prepare("INSERT INTO complaints (identity_id, pin, complaint_text, reply_text, voice) VALUES (?, ?, ?, ?, ?)")
    .run(c.identityId, c.pin, c.complaint, c.reply, c.voice);
  return Number(r.lastInsertRowid);
}

export function getComplaint(id: number) {
  return getDb().prepare("SELECT id, complaint_text, reply_text, wall_status FROM complaints WHERE id = ?").get(id) as
    | { id: number; complaint_text: string; reply_text: string; wall_status: WallStatus }
    | undefined;
}

// Atomic claim: only one caller can move a post out of 'none'. Prevents double posts.
export function claimForWall(id: number): boolean {
  return getDb().prepare("UPDATE complaints SET wall_status = 'pending' WHERE id = ? AND wall_status = 'none'").run(id).changes === 1;
}

export function setWallStatus(id: number, status: WallStatus): void {
  getDb().prepare("UPDATE complaints SET wall_status = ? WHERE id = ?").run(status, id);
}

const WALL_SELECT = `SELECT c.id, c.complaint_text, c.reply_text, c.voice, c.pin, c.created_at, i.title, i.dept, i.place
  FROM complaints c JOIN identities i ON i.id = c.identity_id WHERE c.wall_status = 'approved'`;

type WallRow = { id: number; complaint_text: string; reply_text: string; voice: Voice; pin: string; created_at: string; title: string; dept: string; place: string };

const toPost = (r: WallRow): WallPost => ({
  id: r.id, complaint: r.complaint_text, reply: r.reply_text, voice: r.voice, pin: r.pin, createdAt: r.created_at,
  identity: { title: r.title, dept: r.dept, place: r.place },
});

// since=0: newest `limit` posts; otherwise posts newer than `since`. Always oldest first.
export function approvedPosts(since: number, limit = 40): WallPost[] {
  const rows = (since > 0
    ? getDb().prepare(`${WALL_SELECT} AND c.id > ? ORDER BY c.id ASC LIMIT ?`).all(since, limit)
    : getDb().prepare(`SELECT * FROM (${WALL_SELECT} ORDER BY c.id DESC LIMIT ?) ORDER BY id ASC`).all(limit)) as WallRow[];
  return rows.map(toPost);
}
