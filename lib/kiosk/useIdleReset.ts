"use client";
import { useEffect, useRef } from "react";

// Calls onIdle after `ms` without a key press, tap or input while `active`.
export function useIdleReset(active: boolean, onIdle: () => void, ms = 60000) {
  const cb = useRef(onIdle);
  cb.current = onIdle;
  useEffect(() => {
    if (!active) return;
    let t = setTimeout(() => cb.current(), ms);
    const bump = () => {
      clearTimeout(t);
      t = setTimeout(() => cb.current(), ms);
    };
    const evs = ["keydown", "pointerdown", "pointermove", "input"] as const;
    evs.forEach((e) => window.addEventListener(e, bump));
    return () => {
      clearTimeout(t);
      evs.forEach((e) => window.removeEventListener(e, bump));
    };
  }, [active, ms]);
}
