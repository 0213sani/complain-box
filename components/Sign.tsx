"use client";
import { motion } from "motion/react";

export default function Sign() {
  return (
    <div className="absolute left-[60px] top-[130px] flex items-center gap-6">
      <div className="rotate-[-3deg] border-4 border-ink bg-ochre px-8 py-5 text-ink shadow-[8px_8px_0_var(--color-ink)]">
        <div className="font-sign text-5xl leading-tight">शिकायत यहाँ डालें</div>
        <div className="font-sign text-3xl">Drop your shikayat here</div>
      </div>
      <motion.div
        className="font-sign text-7xl text-cream"
        animate={{ x: [0, 14, 0], y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      >
        ↘
      </motion.div>
    </div>
  );
}
