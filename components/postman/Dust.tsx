"use client";
import { motion } from "motion/react";

// A small puff of dust at (x, bottom of the postman box). dir: which way the dust drifts.
export default function Dust({ x, dir }: { x: number; dir: 1 | -1 }) {
  return (
    <div className="pointer-events-none absolute bottom-0" style={{ left: x }}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-kraft"
          style={{ width: 34 + i * 6, height: 34 + i * 6, bottom: -8 + (i % 2) * 14, left: -20 }}
          initial={{ scale: 0.3, opacity: 0.9, x: 0 }}
          animate={{ scale: 1.6, opacity: 0, x: dir * (30 + i * 22), y: -10 - i * 6 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}
