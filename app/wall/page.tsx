"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import Stage from "@/components/Stage";
import WallColumn from "@/components/wall/WallColumn";
import CardModal from "@/components/wall/CardModal";
import type { WallPost } from "@/lib/repo";
import { useWallFeed } from "@/lib/wall/useWallFeed";
import { COL_H, COLS, DIRS, MAX_PER_COL, SPEEDS, distribute } from "@/lib/wall/layout";

const empty = () => Array.from({ length: COLS }, () => [] as WallPost[]);
const GLOW_MS = 4000;

export default function Wall() {
  const [cols, setCols] = useState<WallPost[][]>(empty);
  const [fresh, setFresh] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<WallPost | null>(null);
  const queue = useRef<WallPost[]>([]);

  // new posts wait until any column reaches its loop boundary (the first to loop takes them)
  const initial = useWallFeed((posts) => {
    queue.current.push(...posts);
  });
  useEffect(() => {
    if (initial) setCols(distribute(initial));
  }, [initial]);

  const onBoundary = useCallback((i: number, offscreen: number[]) => {
    const incoming = queue.current;
    if (!incoming.length) return;
    queue.current = [];
    setCols((prev) => {
      let list = [...prev[i], ...incoming];
      // too many: drop the oldest cards that are currently off screen
      const removable = new Set(offscreen);
      while (list.length > MAX_PER_COL) {
        const oldest = list.filter((p) => removable.has(p.id)).sort((a, b) => a.id - b.id)[0];
        if (!oldest) break;
        list = list.filter((p) => p.id !== oldest.id);
      }
      return prev.map((c, k) => (k === i ? list : c));
    });
    const ids = incoming.map((p) => p.id);
    setFresh((s) => new Set([...s, ...ids]));
    setTimeout(() => setFresh((s) => new Set([...s].filter((id) => !ids.includes(id)))), GLOW_MS);
  }, []);

  return (
    <Stage>
      {/* painted maroon wall */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, #A3261F 0%, #8E1F1B 45%, #5E1411 100%)" }} />
      <div className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: "repeating-linear-gradient(8deg, transparent 0 6px, #2A1609 6px 7px), repeating-linear-gradient(97deg, transparent 0 11px, #2A1609 11px 12px)" }} />

      {/* drifting grid: slight perspective tilt, soft fade top and bottom */}
      <div className="absolute inset-0" style={{
        maskImage: "linear-gradient(transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(transparent 0%, black 14%, black 86%, transparent 100%)",
      }}>
        <div className="absolute left-1/2 top-1/2 flex w-[1560px] gap-[40px]"
          style={{ height: COL_H, transform: "translate(-50%, -50%) perspective(1800px) rotateX(9deg) rotateZ(-4deg)" }}>
          {cols.map((posts, i) => (
            <div key={i} className="h-full flex-1">
              <WallColumn posts={posts} dir={DIRS[i]} speed={SPEEDS[i]} paused={!!open} fresh={fresh}
                onBoundary={(ids) => onBoundary(i, ids)} onOpen={setOpen} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-[40px] top-[32px] z-10 flex items-center gap-6">
        <Link href="/" className="border-4 border-ink bg-ochre px-6 py-3 font-ui text-xl font-semibold text-ink shadow-[5px_5px_0_var(--color-ink)]">
          ← Back to the post box
        </Link>
        <h1 className="font-sign text-5xl text-cream drop-shadow-[3px_3px_0_rgba(42,22,9,0.8)]">शिकायत की दीवार · The Shikayat Wall</h1>
      </div>

      <AnimatePresence>{open && <CardModal post={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </Stage>
  );
}
