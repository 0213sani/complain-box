// Local Ollama client. Never throws: returns null on any failure or timeout.
const OLLAMA_URL = "http://127.0.0.1:11434";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function modelName(): string {
  return process.env.OLLAMA_MODEL || "gemma3:4b";
}

export async function chat(
  messages: ChatMessage[],
  opts: { timeoutMs?: number; json?: boolean; temperature?: number; model?: string } = {}
): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 6000);
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: opts.model ?? modelName(),
        messages,
        stream: false,
        keep_alive: "2h",
        ...(opts.json ? { format: "json" } : {}),
        options: { temperature: opts.temperature ?? 0.9, num_predict: 90 },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { message?: { content?: string } };
    return data.message?.content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function listModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2000) });
    const data = (await res.json()) as { models?: { name: string }[] };
    return (data.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

// Loads the model into memory so the first visitor is not slow.
export async function warmup(): Promise<void> {
  const out = await chat([{ role: "user", content: "Say ok." }], { timeoutMs: 60000 });
  console.log(out === null ? `[llm] warm-up failed (is Ollama running with ${modelName()}?)` : `[llm] ${modelName()} warm`);
}
