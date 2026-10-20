import { chat } from "./llm";
import { cleanReply } from "./clean";
import { checkBlocklist } from "./blocklist";
import { moderate } from "./moderate";
import { replyMessages, type Voice } from "./prompts";
import { fallbackReplies, deflections, pick } from "./fallbackReplies";
import { approvedMemeCount, randomApprovedMemes } from "./repo";

export const MEME_WEIGHT = 0.4; // share of replies in meme voice
const MIN_MEMES = 5;
const DEADLINE_MS = 7000; // client gives up at 8s

export type ReplyResult = { reply: string; voice: Voice; source: "model" | "fallback" | "deflect" };

function chooseVoice(): Voice {
  return Math.random() < MEME_WEIGHT && approvedMemeCount() >= MIN_MEMES ? "meme" : "relative";
}

async function generate(voice: Voice, complaint: string): Promise<string | null> {
  const memes = voice === "meme" ? randomApprovedMemes(3) : [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const out = cleanReply(await chat(replyMessages(voice, complaint, memes), { timeoutMs: attempt === 0 ? 4000 : 2500 }));
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
  if (checkBlocklist(complaint, "private").blocked) return { reply: pick(deflections), voice, source: "deflect" };
  const fallback = new Promise<ReplyResult>((res) =>
    setTimeout(() => res({ reply: pick(fallbackReplies[voice]), voice, source: "fallback" }), DEADLINE_MS)
  );
  return Promise.race([build(complaint, voice), fallback]);
}
