"use client";
import { motion, useAnimate } from "motion/react";
import { POSTBOX, postboxTop, postboxWidth } from "@/lib/kiosk/stage";

// The real post box PNG. Tapping it wobbles, then calls onOpen.
export default function PostBox({ onOpen, enabled }: { onOpen: () => void; enabled: boolean }) {
  const [scope, animate] = useAnimate();
  const tap = async () => {
    if (!enabled) return;
    await animate(scope.current, { rotate: [0, -4, 4, -2, 0] }, { duration: 0.35 });
    onOpen();
  };
  return (
    <motion.button
      ref={scope}
      type="button"
      aria-label="Open the post box"
      onClick={tap}
      className="absolute origin-bottom"
      style={{ left: POSTBOX.left, top: postboxTop, width: postboxWidth, height: POSTBOX.height, cursor: enabled ? "pointer" : "default" }}
      whileHover={enabled ? { scale: 1.02 } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/postbox_tq.png" alt="" draggable={false} className="h-full w-full select-none" />
    </motion.button>
  );
}
