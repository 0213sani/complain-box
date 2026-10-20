"use client";
import { motion } from "motion/react";

// WAITING: empty street, a little bell somewhere far down the road.
export default function DistantBell() {
  return (
    <>
      <motion.svg
        viewBox="0 0 40 40" width={44} height={44}
        className="absolute left-[1380px] top-[740px]"
        animate={{ rotate: [0, -22, 22, -14, 14, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.6 }}
      >
        <path d="M8 30 q0 -22 12 -22 q12 0 12 22 z" fill="#E0A63C" stroke="#4A2A17" strokeWidth={3} />
        <circle cx={20} cy={33} r={4} fill="#4A2A17" />
      </motion.svg>
      <motion.p
        className="absolute left-1/2 top-[40px] -translate-x-1/2 rounded-full border-4 border-ink bg-cream px-6 py-2 font-ui text-2xl text-ink"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      >
        Tring tring… the postman is on his way back
      </motion.p>
    </>
  );
}
