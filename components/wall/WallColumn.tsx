"use client";
import { useEffect, useRef } from "react";
import type { WallPost } from "@/lib/repo";
import { COL_H, GAP, VIEW_H, colHeight } from "@/lib/wall/layout";
import WallCard from "./WallCard";

// One endlessly drifting column. Cards are rendered in 2+ copies (enough to always fill the column); when one copy has scrolled past,
// the offset wraps (the view is identical), and the parent may merge queued posts at that moment.
export default function WallColumn({ posts, dir, speed, paused, fresh, onBoundary, onOpen }: {
  posts: WallPost[]; dir: -1 | 1; speed: number; paused: boolean; fresh: Set<number>;
  onBoundary: (offscreenIds: number[]) => void; onOpen: (p: WallPost) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const state = useRef({ paused, onBoundary });
  state.current = { paused, onBoundary };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      const h = (copy.current?.offsetHeight ?? 0) + GAP; // read every frame: never stale after a merge
      if (h > GAP && !state.current.paused) {
        offset.current += speed * dt;
        if (offset.current >= h) {
          offset.current -= h;
          // cards whose top is below the visible area of this copy can be dropped without a jump
          const ids = Array.from(copy.current!.querySelectorAll<HTMLElement>("[data-id]"))
            .filter((el) => el.offsetTop > VIEW_H)
            .map((el) => Number(el.dataset.id));
          state.current.onBoundary(ids);
        }
      }
      if (track.current) {
        const y = dir === -1 ? -offset.current : offset.current - h;
        track.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dir, speed]);

  const copies = posts.length ? Math.max(2, Math.ceil(COL_H / colHeight(posts)) + 1) : 0;
  const list = (key: string, ref?: React.Ref<HTMLDivElement>) => (
    <div key={key} ref={ref} className="flex flex-col" style={{ gap: GAP }}>
      {posts.map((p) => (
        <WallCard key={`${key}${p.id}`} post={p} fresh={fresh.has(p.id)} onOpen={() => onOpen(p)} />
      ))}
    </div>
  );

  return (
    <div className="relative h-full overflow-visible">
      <div ref={track} className="flex flex-col will-change-transform" style={{ gap: GAP }}>
        {list("c0", copy)}
        {Array.from({ length: copies - 1 }, (_, k) => list(`c${k + 1}`))}
      </div>
    </div>
  );
}
