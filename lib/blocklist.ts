// Layer 1 moderation: deterministic word lists + contact-detail patterns.
// Words are matched letter-by-letter with repeats allowed (f+u+c+k+), so "fuuuck"
// matches "fuck" while "as" never matches "ass".

// Matched as whole tokens only (short or ambiguous words).
const TOKENS = [
  // English
  "fuck", "fucker", "fucking", "fck", "fuk", "fuq", "phuck", "wtf", "stfu", "shit", "shyt", "bullshit",
  "ass", "arse", "asshole", "bitch", "bastard", "cunt", "dick", "cock", "pussy", "slut", "whore", "porn",
  "sex", "sexy", "nude", "nudes", "boobs", "tits", "penis", "vagina", "rape", "rapist", "horny", "dildo",
  "nigger", "nigga", "faggot", "fag", "retard", "retarded", "tranny", "chink", "paki", "kike", "spic", "kys",
  // Hinglish (Roman)
  "mc", "bc", "bkl", "mkc", "bsdk", "bhosdike", "bhosdi", "bhosda", "madarchod", "madarchot", "behenchod",
  "bhenchod", "benchod", "chutiya", "chutiye", "chutia", "chootiya", "chootiye", "choot", "chut", "gandu", "gaandu", "gaand", "gand",
  "lund", "lauda", "lavda", "loda", "lodu", "lode", "laude", "lavde", "chtiya", "chutya", "chtiye", "randi", "raand", "harami", "haramkhor", "kamina", "kamine",
  "chodu", "jhaat", "jhatu", "tatte", "bhadwa", "bhadwe", "hijda", "hijra", "chamar", "bhangi",
  "katua", "kutti", "saali", "suar",
  // Devanagari
  "मादरचोद", "बहनचोद", "बहिनचोद", "भेनचोद", "चूतिया", "चुतिया", "चूत", "गांडू", "गांड", "गाण्ड", "भोसडी",
  "भोसड़ी", "भोसडीके", "रंडी", "रण्डी", "हरामी", "लौड़ा", "लौडा", "लंड", "लण्ड", "कुत्ती", "हिजड़ा", "हिजडा",
  "चमार", "भंगी", "झाट", "कमीना", "कमीने", "साली",
];

// Distinctive enough to match inside squashed text ("f u c k", "f.u.c.k", "madar-chod").
const SUBSTRINGS = [
  "fuck", "motherf", "asshole", "bitch", "nigger", "nigga", "faggot", "madarchod", "behenchod", "bhenchod",
  "benchod", "chutiya", "chutiye", "chootiya", "bhosd", "lauda", "lavda", "haramkhor",
  "मादरचोद", "बहनचोद", "भेनचोद", "चूतिया", "चुतिया", "भोसड",
];

const PHRASES = ["teri maa", "teri behen", "teri ma ki", "kill yourself", "go die", "hook up", "nice body", "तेरी माँ", "तेरी मां"];

// Self-harm gets a kind reply, never sarcasm (see lib/reply.ts).
export const SELF_HARM = /\b(kill myself|killing myself|suicid\w*|end my life|want to die|wanna die|marna chaht[ai]|mar jaung[ai]|khudkushi)\b/i;

// Public wall only: topics we never want on the wall.
const PUBLIC_TOKENS = [
  "bjp", "congress", "modi", "rahul", "gandhi", "kejriwal", "election", "elections", "vote", "politics",
  "political", "hindu", "hindus", "muslim", "muslims", "islam", "christian", "sikh", "allah", "bhagwan",
  "mandir", "masjid", "church", "temple", "mosque", "brahmin", "brahmins", "dalit", "dalits", "caste", "jaati", "reservation",
  "pakistan", "pakistani", "terrorist", "मोदी", "हिंदू", "मुस्लिम", "जाति", "मंदिर", "मस्जिद",
];

const CONTACT: [RegExp, string][] = [
  [/(?:\+?\d[\s\-().]*){10,}/, "phone number"],
  [/[a-z0-9._%+-]+\s*(@|\[at\]|\(at\))\s*[a-z0-9-]+\s*(\.|\[dot\]|\(dot\))\s*[a-z]{2,}/i, "email"],
  [/(https?:\/\/|www\.)\S+|\b[a-z0-9-]{2,}\.(com|in|org|net|io|co|me|xyz|app|dev|ly|gg|info|site)\b/i, "link"],
  [/(^|[^a-z0-9])@[a-z0-9_.]{2,}/i, "handle"],
  [/\b[a-z0-9._-]+\s+at\s+[a-z0-9-]+\s+dot\s+(com|in|org|net|co|edu)\b/i, "email"],
];

// Real named people on the wall: "Prof. Mehta", "Sharma sir", "Riya ma'am".
const NAMED_PERSON = /\b(?:[Pp]rof|[Pp]rofessor|[Dd]r|[Mm]rs?|[Mm]s|[Mm]iss|[Ss]ir|[Mm]adam)\.?\s+[A-Z][a-z]{2,}|\b[A-Z][a-z]{2,}\s+(?:sir|ma'?am|madam)\b/;

// Look-alike letters from other scripts (Cyrillic, Greek, Armenian) -> Latin.
const CONFUSABLE: Record<string, string> = {
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "у": "y", "х": "x", "к": "k", "і": "i", "ј": "j", "ѕ": "s", "т": "t", "м": "m", "н": "h", "в": "b",
  "α": "a", "ο": "o", "ε": "e", "ι": "i", "κ": "k", "ν": "v", "τ": "t", "υ": "u", "ս": "u", "օ": "o", "ı": "i",
};

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", "$": "s", "!": "i", "|": "i", "+": "t" };

function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-़ͯ​-‍﻿]/g, "") // Latin accents, nukta, zero-width
    .toLowerCase()
    .replace(/[^\x00-\x7f\u0900-\u097f]/g, (c) => CONFUSABLE[c] ?? c)
    .replace(/[0-9@$!|+]/g, (c) => LEET[c] ?? c);
}

function tokens(norm: string): string[] {
  const raw = norm.split(/[^\p{L}\p{M}*]+/u).filter(Boolean).map((t) => t.replace(/\*/g, ""));
  // join runs of single letters: "f u c k" -> "fuck"
  const out: string[] = [];
  let run = "";
  for (const t of raw) {
    if ([...t].length === 1) run += t;
    else {
      if (run.length > 1) out.push(run);
      run = "";
      out.push(t);
    }
  }
  if (run.length > 1) out.push(run);
  return out;
}

const esc = (c: string) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const repeatable = (w: string) => [...w.normalize("NFKD").replace(/़/g, "")].map((c) => `${esc(c)}+`).join("");
const tokenRe = (list: string[]) => new RegExp(`^(?:${list.map(repeatable).join("|")})$`, "u");

const TOKEN_RE = tokenRe(TOKENS);
const PUBLIC_RE = tokenRe(PUBLIC_TOKENS);
const SUBSTR_RE = new RegExp(SUBSTRINGS.map(repeatable).join("|"), "u");

export type BlockResult = { blocked: boolean; reason?: string };

export function checkBlocklist(text: string, level: "private" | "public" = "private"): BlockResult {
  if (SELF_HARM.test(text)) return { blocked: true, reason: "self-harm" };
  for (const [re, why] of CONTACT) if (re.test(text)) return { blocked: true, reason: why };
  if (level === "public" && NAMED_PERSON.test(text)) return { blocked: true, reason: "named person" };

  const norm = normalize(text);
  const toks = tokens(norm);
  const hit = toks.find((t) => TOKEN_RE.test(t));
  if (hit) return { blocked: true, reason: `word: ${hit}` };
  if (SUBSTR_RE.test(norm.replace(/[^\p{L}\p{M}]+/gu, ""))) return { blocked: true, reason: "hidden word" };

  const spaced = " " + toks.join(" ") + " ";
  const phrase = PHRASES.find((p) => spaced.includes(" " + normalize(p) + " ") || spaced.includes(" " + normalize(p)));
  if (phrase) return { blocked: true, reason: `phrase: ${phrase}` };

  if (level === "public") {
    const topic = toks.find((t) => PUBLIC_RE.test(t));
    if (topic) return { blocked: true, reason: `topic: ${topic}` };
  }
  return { blocked: false };
}
