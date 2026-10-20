import { chat } from "./llm";
import { cleanReply } from "./clean";
import { checkBlocklist, SELF_HARM } from "./blocklist";
import { moderate } from "./moderate";
import { replyMessages, type Voice } from "./prompts";
import { careReply, fallbackReplies, deflections, pick } from "./fallbackReplies";
import { approvedMemeCount, randomApprovedMemes } from "./repo";

export const MEME_WEIGHT = 0.7; // share of replies in meme voice (user: more memes than plain replies)
const MIN_MEMES = 5;
const DEADLINE_MS = 7000; // client gives up at 8s

export type ReplyResult = { reply: string; voice: Voice; source: "model" | "fallback" | "deflect" };

function chooseVoice(): Voice {
  return Math.random() < MEME_WEIGHT && approvedMemeCount() >= MIN_MEMES ? "meme" : "relative";
}

async function generate(voice: Voice, complaint: string): Promise<string | null> {
  const memes = voice === "meme" ? randomApprovedMemes(3) : [];
  // Ollama runs one request at a time and moderation is queued first, so the first try gets 5s
  for (let attempt = 0; attempt < 2; attempt++) {
    const out = cleanReply(await chat(replyMessages(voice, complaint, memes), { timeoutMs: attempt === 0 ? 5000 : 1800 }));
    if (out && !checkBlocklist(out, "private").blocked) return out;
  }
  return null;
}

async function build(complaint: string, voice: Voice): Promise<ReplyResult> {
  // moderation and generation run in parallel; an unsafe verdict discards the reply
  const [mod, out] = await Promise.all([moderate(complaint, "private", 6500), generate(voice, complaint)]);
  if (!mod.safe) return { reply: pick(deflections), voice, source: "deflect" };
  return out ? { reply: out, voice, source: "model" } : { reply: pick(fallbackReplies[voice]), voice, source: "fallback" };
}

export async function generateReply(complaint: string): Promise<ReplyResult> {
  const voice = chooseVoice();
  if (SELF_HARM.test(complaint)) return { reply: careReply, voice: "relative", source: "deflect" };
  if (checkBlocklist(complaint, "private").blocked) return { reply: pick(deflections), voice, source: "deflect" };
  const fallback = new Promise<ReplyResult>((res) =>
    setTimeout(() => res({ reply: pick(fallbackReplies[voice]), voice, source: "fallback" }), DEADLINE_MS)
  );
  return Promise.race([build(complaint, voice), fallback]);
}
