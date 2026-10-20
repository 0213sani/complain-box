"use client";
import { motion } from "motion/react";
import { POSTMAN, STAGE } from "@/lib/kiosk/stage";

export type PostmanMode = "idle" | "leave" | "gone" | "return";

// Step 3 placeholder (no text, so it can be mirrored). Real sprite comes in step 4.
export default function PlaceholderPostman({ mode, onDone }: { mode: PostmanMode; onDone: (m: PostmanMode) => void }) {
  const off = STAGE.w - POSTMAN.left + 40;
  const anim =
    mode === "leave" ? { x: off, scaleX: 1, opacity: 1, transition: { delay: 0.5, duration: 2, ease: "easeIn" as const, scaleX: { duration: 0 } } }
    : mode === "return" ? { x: [off, 0], scaleX: -1, opacity: 1, transition: { duration: 2, ease: "easeOut" as const, scaleX: { duration: 0 } } }
    : mode === "gone" ? { x: off, opacity: 0, transition: { duration: 0 } }
    : { x: 0, scaleX: 1, opacity: 1, transition: { duration: 0.2, scaleX: { duration: 0 } } };
  const spinning = mode === "leave" || mode === "return";
  return (
    <motion.div
      className="absolute"
      style={{ left: POSTMAN.left, top: STAGE.ground - POSTMAN.h, width: POSTMAN.w, height: POSTMAN.h }}
      animate={anim}
      onAnimationComplete={() => onDone(mode)}
    >
      {/* rider */}
      <div className="absolute left-[95px] top-0 h-[60px] w-[60px] rounded-full bg-ink" />
      <div className="absolute left-[85px] top-[55px] h-[90px] w-[80px] rounded-t-3xl bg-kraft" />
      <div className="absolute left-[150px] top-[10px] h-[18px] w-[30px] bg-maroon" /> {/* cap peak: shows facing */}
      {/* frame + wheels */}
      <div className="absolute left-[40px] top-[150px] h-[10px] w-[180px] bg-ink" />
      {[0, 150].map((x) => (
        <motion.div
          key={x}
          className="absolute top-[140px] h-[100px] w-[100px] rounded-full border-[8px] border-ink"
          style={{ left: x - 10, borderTopColor: "var(--color-ochre)" }}
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={spinning ? { repeat: Infinity, duration: 0.4, ease: "linear" } : { duration: 0 }}
        />
      ))}
    </motion.div>
  );
}
