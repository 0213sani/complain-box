// Layer 2 moderation: ask the local model for strict JSON {safe, reason}.
import { chat } from "./llm";
import { moderationMessages } from "./prompts";

export type ModResult = { safe: boolean; reason: string; ok: boolean }; // ok=false: model failed

export async function moderate(text: string, level: "private" | "public", timeoutMs = 6000): Promise<ModResult> {
  const raw = await chat(moderationMessages(text, level), { json: true, temperature: 0, timeoutMs });
  try {
    const j = JSON.parse(raw ?? "");
    if (typeof j.safe !== "boolean") throw new Error("bad shape");
    return { safe: j.safe, reason: String(j.reason ?? ""), ok: true };
  } catch {
    // public fails closed; private relies on the blocklist that already ran
    return { safe: level === "private", reason: "moderation unavailable", ok: false };
  }
}
