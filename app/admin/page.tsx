"use client";
import { useCallback, useEffect, useState } from "react";
import type { MemeRow, WallPost } from "@/lib/repo";

type AdminPost = WallPost & { isSeed: boolean };
type Data = { pending: AdminPost[]; approved: AdminPost[] };
type Memes = { pending: MemeRow[]; approved: MemeRow[] };
const MIN_MEMES = 5; // meme voice needs at least this many approved

function Row({ p, actions }: { p: AdminPost; actions: React.ReactNode }) {
  return (
    <li className="flex items-start gap-6 border-b border-ink/15 py-4">
      <div className="flex-1">
        <div className="text-sm text-ink/60">
          #{p.id} · {p.identity.title} · {new Date(p.createdAt.replace(" ", "T") + "Z").toLocaleTimeString()} · {p.voice}
          {p.isSeed && " · seed"}
        </div>
        <div className="mt-1 text-ink/80">Re: {p.complaint}</div>
        <div className="mt-1 font-hand text-2xl text-ink">{p.reply}</div>
      </div>
      <div className="flex shrink-0 gap-2">{actions}</div>
    </li>
  );
}

function MemeItem({ m, actions }: { m: MemeRow; actions: React.ReactNode }) {
  return (
    <li className="flex items-start gap-6 border-b border-ink/15 py-3">
      <div className="flex-1">
        <div className="font-hand text-2xl text-ink">{m.phrase}</div>
        <div className="text-ink/70">{m.note}</div>
        <div className="text-sm text-ink/50">{m.source}</div>
      </div>
      <div className="flex shrink-0 gap-2">{actions}</div>
    </li>
  );
}

// Plain moderation queue. Local only, no auth (kiosk browser stays fullscreen on "/").
export default function Admin() {
  const [data, setData] = useState<Data>({ pending: [], approved: [] });
  const [memes, setMemes] = useState<Memes>({ pending: [], approved: [] });
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [r, m] = await Promise.all([fetch("/api/admin/posts", { cache: "no-store" }), fetch("/api/admin/memes", { cache: "no-store" })]);
      setData(await r.json());
      setMemes(await m.json());
    } catch {}
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const decide = async (id: number, status: "approved" | "rejected", kind: "posts" | "memes" = "posts") => {
    setBusy(`${kind}${id}`);
    await fetch(`/api/admin/${kind}/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }).catch(() => {});
    setBusy(null);
    load();
  };

  const btn = "border-2 border-ink px-4 py-2 font-semibold disabled:opacity-40";

  return (
    <main className="min-h-screen bg-cream px-10 py-8 font-ui text-ink">
      <h1 className="font-sign text-4xl">Editor&apos;s desk</h1>
      <p className="text-ink/60">Approve posts for the public wall. Refreshes every 5s.</p>

      <h2 className="mt-8 text-2xl font-semibold">Waiting for approval ({data.pending.length})</h2>
      {data.pending.length === 0 && <p className="py-4 text-ink/50">Nothing waiting. Chai break.</p>}
      <ul>
        {data.pending.map((p) => (
          <Row key={p.id} p={p} actions={<>
            <button className={`${btn} bg-leaf text-cream`} disabled={busy === `posts${p.id}`} onClick={() => decide(p.id, "approved")}>Approve</button>
            <button className={`${btn} bg-brick text-cream`} disabled={busy === `posts${p.id}`} onClick={() => decide(p.id, "rejected")}>Reject</button>
          </>} />
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Live on the wall ({data.approved.length})</h2>
      <p className="text-sm text-ink/60">Removed posts disappear from an open wall after it reloads.</p>
      <ul>
        {data.approved.map((p) => (
          <Row key={p.id} p={p} actions={
            <button className={`${btn} bg-cream`} disabled={busy === `posts${p.id}`} onClick={() => decide(p.id, "rejected")}>Remove</button>
          } />
        ))}
      </ul>

      <h2 className="mt-12 text-2xl font-semibold">Memes waiting ({memes.pending.length})</h2>
      <p className="text-sm text-ink/60">Add more with /refresh-memes in Claude Code, then npm run memes:import.</p>
      {memes.approved.length < MIN_MEMES && (
        <p className="mt-2 font-semibold text-brick">Only {memes.approved.length} approved: the meme voice is off until at least {MIN_MEMES} are approved.</p>
      )}
      <ul>
        {memes.pending.map((m) => (
          <MemeItem key={m.id} m={m} actions={<>
            <button className={`${btn} bg-leaf text-cream`} disabled={busy === `memes${m.id}`} onClick={() => decide(m.id, "approved", "memes")}>Approve</button>
            <button className={`${btn} bg-brick text-cream`} disabled={busy === `memes${m.id}`} onClick={() => decide(m.id, "rejected", "memes")}>Reject</button>
          </>} />
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Memes in use ({memes.approved.length})</h2>
      <ul>
        {memes.approved.map((m) => (
          <MemeItem key={m.id} m={m} actions={
            <button className={`${btn} bg-cream`} disabled={busy === `memes${m.id}`} onClick={() => decide(m.id, "rejected", "memes")}>Remove</button>
          } />
        ))}
      </ul>
    </main>
  );
}
