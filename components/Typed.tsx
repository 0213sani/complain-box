"use client";
import { useEffect, useRef, useState } from "react";

// Reveals `text` character by character over `ms`, after `delay`.
export default function Typed({ text, ms, delay = 0, onDone, className }: {
  text: string; ms: number; delay?: number; onDone?: () => void; className?: string;
}) {
  const chars = Array.from(text);
  const [n, setN] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    setN(0);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - start) / ms));
      setN(Math.round(k * chars.length));
      if (k < 1) raf = requestAnimationFrame(tick);
      else done.current?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, ms, delay]);
  return <span className={className}>{chars.slice(0, n).join("")}</span>;
}
