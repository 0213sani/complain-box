"use client";
import { motion } from "motion/react";

// Painted tin board screwed to the wall, with a pulsing arrow to the post box slot.
export default function Sign() {
  return (
    <div className="absolute left-[50px] top-[130px]">
      <div className="relative rotate-[-2deg] border-[5px] border-ink bg-ochre px-9 py-5 text-ink shadow-[10px_10px_0_var(--color-maroon)]">
        {["left-2 top-2", "right-2 top-2", "left-2 bottom-2", "right-2 bottom-2"].map((p) => (
          <span key={p} className={`absolute ${p} h-3 w-3 rounded-full bg-ink/70`} />
        ))}
        <div className="font-sign text-[54px] leading-tight">शिकायत यहाँ डालें</div>
        <div className="font-sign text-[30px] leading-tight">Drop your shikayat here</div>
      </div>
      <motion.svg
        viewBox="0 0 100 100" width={96} height={96}
        className="absolute left-[440px] top-[100px]"
        animate={{ x: [0, 12, 0], y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
      >
        <path d="M14 22 L58 66 L58 40 L74 40 L74 84 L30 84 L30 68 L50 68 L6 24 Z" transform="translate(6 6)" fill="#4A2A17" />
        <path d="M14 22 L58 66 L58 40 L74 40 L74 84 L30 84 L30 68 L50 68 L6 24 Z" fill="#F3E3C0" stroke="#4A2A17" strokeWidth={4} strokeLinejoin="round" />
      </motion.svg>
    </div>
  );
}
