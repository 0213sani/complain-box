// Loads data/memes.pending.json into the memes table as 'pending' (approve them in /admin).
// Format: [{ "phrase": "Kitne aadmi the?", "note": "when asking how many...", "source": "Sholay (1975)" }]
import fs from "node:fs";
import path from "node:path";
import { checkBlocklist } from "../lib/blocklist";
import { insertPendingMeme } from "../lib/repo";

const FILE = path.join(process.cwd(), "data", "memes.pending.json");
const MAX_WORDS = 8;

if (!fs.existsSync(FILE)) {
  console.log(`No ${path.relative(process.cwd(), FILE)} found. Run /refresh-memes in Claude Code, or paste a list in that format.`);
  process.exit(1);
}

let items: unknown;
try {
  items = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch (e) {
  console.log(`Could not parse ${FILE}: ${(e as Error).message}`);
  process.exit(1);
}
if (!Array.isArray(items)) {
  console.log("Expected a JSON array of { phrase, note, source }.");
  process.exit(1);
}

let added = 0;
const skipped: string[] = [];
for (const raw of items as Record<string, unknown>[]) {
  const phrase = String(raw?.phrase ?? "").trim().replace(/\s+/g, " ");
  const note = String(raw?.note ?? "").trim().replace(/\s+/g, " ");
  const source = String(raw?.source ?? "refresh-memes").trim().slice(0, 120);
  const why =
    !phrase || !note ? "missing phrase or note"
    : phrase.split(" ").length > MAX_WORDS ? `over ${MAX_WORDS} words`
    : phrase.length > 70 || note.length > 160 ? "too long"
    : checkBlocklist(`${phrase} ${note}`, "public").blocked ? `blocklist (${checkBlocklist(`${phrase} ${note}`, "public").reason})`
    : !insertPendingMeme(phrase, note, source) ? "duplicate"
    : null;
  if (why) skipped.push(`  - ${phrase || "(empty)"}: ${why}`);
  else added++;
}

console.log(`Added ${added} meme(s) as pending. Approve them at http://127.0.0.1:3000/admin`);
if (skipped.length) console.log(`Skipped ${skipped.length}:\n${skipped.join("\n")}`);
