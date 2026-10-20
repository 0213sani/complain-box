// Post-process small-model output into a short, plain reply (or null if unusable).
const PREAMBLE = /^(sure|okay|ok|here('s| is)|alright|of course|certainly)\b[^:\n.!]*[:.!]\s*/i;
const LABEL = /^(reply|response|answer|uncle|aunty|aunt|relative)\s*:\s*/i;
const REFUSAL = /\b(i can'?t|i cannot|i'?m sorry|as an ai|i am not able|i'm unable|language model|i won'?t)\b/i;

export function cleanReply(raw: string | null): string | null {
  if (!raw) return null;
  let t = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\*+|_{2,}|#+/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .split("\n").map((l) => l.trim()).filter(Boolean)[0] ?? "";
  for (let i = 0; i < 2; i++) t = t.replace(PREAMBLE, "").replace(LABEL, "");
  t = t.replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "").trim();
  if (!t || REFUSAL.test(t)) return null;

  // keep at most 2 sentences
  const sentences = t.match(/[^.!?]+[.!?]+["'”’]?|[^.!?]+$/g) ?? [t];
  t = sentences.slice(0, 2).join(" ").replace(/\s+/g, " ").trim();
  if (t.length < 8) return null;
  if (t.length > 220) t = t.slice(0, 217).replace(/\s+\S*$/, "") + "...";
  return t;
}
