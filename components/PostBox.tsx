"use client";
import { motion } from "motion/react";
import { POSTBOX } from "@/lib/kiosk/stage";

// Invisible tap area over the post box painted in the background; glows so people know to tap it.
export default function PostBox({ onOpen, enabled }: { onOpen: () => void; enabled: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label="Open the post box"
      onClick={() => enabled && onOpen()}
      className="absolute rounded-t-[45%] rounded-b-lg"
      style={{ left: POSTBOX.left, top: POSTBOX.top, width: POSTBOX.w, height: POSTBOX.h, cursor: enabled ? "pointer" : "default" }}
      animate={enabled ? { boxShadow: ["0 0 0px 0px rgba(240,200,120,0)", "0 0 46px 12px rgba(240,200,120,0.55)", "0 0 0px 0px rgba(240,200,120,0)"] } : { boxShadow: "0 0 0px 0px rgba(240,200,120,0)" }}
      transition={enabled ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      whileTap={{ scale: 0.97 }}
    />
  );
}
