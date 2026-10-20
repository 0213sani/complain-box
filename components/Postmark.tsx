"use client";
import { useId } from "react";
import { motion } from "motion/react";

// Circular ink postmark that "lands" with a thump.
export default function Postmark({ label, size = 190, rotate = -12, delay = 0, onLanded }: {
  label: string; size?: number; rotate?: number; delay?: number; onLanded?: () => void;
}) {
  const id = useId();
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      initial={{ scale: 1.8, opacity: 0, rotate: rotate - 20 }}
      animate={{ scale: 1, opacity: 0.85, rotate }}
      transition={{ delay, type: "spring", stiffness: 500, damping: 22 }}
      onAnimationComplete={onLanded}
      className="pointer-events-none text-maroon mix-blend-multiply"
    >
      <defs>
        <path id={`${id}t`} d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id={`${id}b`} d="M 26 100 A 74 74 0 0 0 174 100" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="3" />
      <g fill="currentColor" fontWeight="600" style={{ fontFamily: "var(--font-hind)" }}>
        <text fontSize="17" letterSpacing="3">
          <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">TAQNEEQ POST</textPath>
        </text>
        <text fontSize="17" letterSpacing="3">
          <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">तकनीक डाक</textPath>
        </text>
        <text x="100" y="98" fontSize={label.length > 7 ? 19 : 23} textAnchor="middle" letterSpacing="1">{label}</text>
        <text x="100" y="120" fontSize="12" textAnchor="middle">{date}</text>
      </g>
    </motion.svg>
  );
}
