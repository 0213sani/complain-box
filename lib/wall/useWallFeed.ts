"use client";
import { useEffect, useRef, useState } from "react";
import type { WallPost } from "../repo";

const POLL_MS = 4000;

// Loads the newest approved posts once, then reports newer ones every 4s via onNew.
export function useWallFeed(onNew: (posts: WallPost[]) => void) {
  const [initial, setInitial] = useState<WallPost[] | null>(null);
  const lastSeq = useRef(0); // approval order, so late approvals of older posts still arrive
  const loaded = useRef(false);
  const cb = useRef(onNew);
  cb.current = onNew;

  useEffect(() => {
    let live = true;
    const get = async (since: number) => {
      try {
        const r = await fetch(`/api/wall?since=${since}`, { cache: "no-store" });
        return ((await r.json()).posts ?? []) as WallPost[];
      } catch {
        return [];
      }
    };
    get(0).then((posts) => {
      if (!live) return;
      lastSeq.current = posts.reduce((m, p) => Math.max(m, p.seq), 0);
      loaded.current = true;
      setInitial(posts);
    });
    const t = setInterval(async () => {
      if (!live || !loaded.current) return; // wait for the first load
      const posts = await get(lastSeq.current);
      if (!live || !posts.length) return;
      lastSeq.current = posts.reduce((m, p) => Math.max(m, p.seq), lastSeq.current);
      cb.current(posts);
    }, POLL_MS);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  return initial;
}
