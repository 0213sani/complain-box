"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Identity, ReplyData, WallState } from "@/lib/kiosk/machine";
import { Address, PostcardBase, writingAreaStyle } from "./Postcard";
import Typed from "./Typed";
import Postmark from "./Postmark";

const WALL_MSG: Partial<Record<WallState, string>> = {
  posting: "Checking with the post office…",
  pending: "Forwarded to the Editor. Look for it on the wall soon.",
  approved: "Posted! Find it on the public wall.",
  rejected: "This one's staying private.",
};

export default function ReplyCard({ identity, complaint, reply, wall, onPost, onClose, onWall }: {
  identity: Identity; complaint: string; reply: ReplyData; wall: WallState;
  onPost: () => void; onClose: () => void; onWall: () => void;
}) {
  const [typed, setTyped] = useState(false);
  const [landed, setLanded] = useState(false);
  const ms = Math.min(1800, reply.reply.length * 22);

  return (
    <div className="flex flex-col items-center gap-4">
      <PostcardBase className="w-[1300px]">
        <div className="absolute flex flex-col gap-4" style={writingAreaStyle}>
          <p className="truncate font-ui text-lg text-ink/60">Re: {complaint}</p>
          <Typed text={reply.reply} ms={ms} delay={300} onDone={() => setTyped(true)} className="font-hand text-[42px] leading-[1.35] text-ink" />
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Address identity={identity} typed={false} />
        </motion.div>
        {typed && (
          <div className="absolute" style={{ left: "56%", top: "3%" }}>
            <Postmark label="REPLIED" onLanded={() => setLanded(true)} />
          </div>
        )}
        {(wall === "pending" || wall === "approved") && (
          <div className="absolute" style={{ left: "40%", top: "60%" }}>
            <Postmark label={wall === "pending" ? "RECEIVED" : "POSTED"} rotate={9} size={170} />
          </div>
        )}
      </PostcardBase>

      <motion.div
        className="flex w-[1300px] items-center justify-center gap-6 font-ui text-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={landed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: landed ? "auto" : "none" }}
      >
        {wall === "idle" ? (
          <button onClick={onPost} className="border-4 border-ink bg-brick px-7 py-3 font-semibold text-cream shadow-[5px_5px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none">
            Post to public wall
          </button>
        ) : (
          <p className="max-w-[520px] text-center text-cream">{WALL_MSG[wall]}</p>
        )}
        <button onClick={onClose} className="border-4 border-ink bg-cream px-7 py-3 font-semibold text-ink shadow-[5px_5px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none">
          Close this post
        </button>
        <button onClick={onWall} className="border-4 border-ink bg-ochre px-7 py-3 font-semibold text-ink shadow-[5px_5px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none">
          Go to public wall
        </button>
      </motion.div>
    </div>
  );
}
