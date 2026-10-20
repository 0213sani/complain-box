import { getDb } from "../lib/db";
import { identities, memes, exchanges } from "./seed-data";

const db = getDb();
const randPin = () => String(100000 + Math.floor(Math.random() * 900000));

db.transaction(() => {
  // identities: replace all so edits to seed-data take effect
  if ((db.prepare("SELECT COUNT(*) n FROM complaints WHERE is_seed = 0").get() as { n: number }).n === 0) {
    db.prepare("DELETE FROM complaints").run();
    db.prepare("DELETE FROM identities").run();
    const insId = db.prepare("INSERT INTO identities (id, title, dept, place) VALUES (?, ?, ?, ?)");
    identities.forEach(([t, d, p], i) => insId.run(i + 1, t, d, p));
  } else {
    console.log("Real complaints exist: keeping identities, only refreshing seed exchanges.");
    db.prepare("DELETE FROM complaints WHERE is_seed = 1").run();
  }

  const insEx = db.prepare(
    "INSERT INTO complaints (identity_id, pin, complaint_text, reply_text, voice, wall_status, is_seed) VALUES (?, ?, ?, ?, ?, 'approved', 1)"
  );
  for (const [idx, c, r, v] of exchanges) insEx.run(idx + 1, randPin(), c, r, v);

  // memes: add missing ones as approved, never overwrite your review decisions
  const insMeme = db.prepare("INSERT OR IGNORE INTO memes (phrase, note, source, status) VALUES (?, ?, 'seed', 'approved')");
  for (const [p, n] of memes) insMeme.run(p, n);
})();

const count = (t: string) => (db.prepare(`SELECT COUNT(*) n FROM ${t}`).get() as { n: number }).n;
console.log(`identities ${count("identities")}, complaints ${count("complaints")}, memes ${count("memes")}`);
