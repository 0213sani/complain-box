"use client";
import { useEffect } from "react";
import { motion } from "motion/react";
import type { WallPost } from "@/lib/repo";
import { Address, PostcardBase, writingAreaStyle } from "../Postcard";
import Postmark from "../Postmark";

// A wall post opened full size on the real postcard.
export default function CardModal({ post, onClose }: { post: WallPost; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-ink/60"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}>
        <PostcardBase className="w-[1250px]">
          <div className="absolute flex flex-col gap-4" style={writingAreaStyle}>
            <p className="font-ui text-lg text-ink/60">Re: {post.complaint}</p>
            <p className="font-hand text-[40px] leading-[1.35] text-ink">{post.reply}</p>
          </div>
          <Address identity={{ id: post.id, ...post.identity, pin: post.pin }} typed={false} />
          <div className="absolute" style={{ left: "56%", top: "3%" }}>
            <Postmark label="REPLIED" />
          </div>
        </PostcardBase>
        <p className="mt-4 text-center font-ui text-xl text-cream">Tap anywhere outside or press Esc to go back to the wall</p>
      </motion.div>
    </motion.div>
  );
}
