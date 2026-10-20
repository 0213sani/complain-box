"use client";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { initialState, reducer } from "@/lib/kiosk/machine";
import { fetchIdentity, postToWall, sendComplaint } from "@/lib/kiosk/api";
import { useIdleReset } from "@/lib/kiosk/useIdleReset";
import { CARD, cardCenter, slotCenter } from "@/lib/kiosk/stage";
import Stage from "./Stage";
import StreetScene from "./scene/StreetScene";
import PostBox from "./PostBox";
import Sign from "./Sign";
import Postman, { type PostmanMode } from "./postman/Postman";
import DistantBell from "./DistantBell";
import WritingCard from "./WritingCard";
import ReplyCard from "./ReplyCard";

const toSlot = { x: slotCenter.x - cardCenter.x, y: slotCenter.y - cardCenter.y };
const cardVariants = {
  hidden: { y: 1000 },
  shown: { y: 0, x: 0, scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  // exit depends on why the card leaves: posted into the slot, closed down, or done (slides left)
  exit: (how: string) =>
    how === "slot" ? { ...toSlot, scale: 0.12, opacity: [1, 1, 0], transition: { duration: 0.5, ease: "easeIn" as const } }
    : how === "left" ? { x: -1600, transition: { duration: 0.5, ease: "easeIn" as const } }
    : { y: 1000, transition: { duration: 0.4, ease: "easeIn" as const } },
};

export default function Kiosk() {
  const [s, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const visit = useRef(0); // ignores replies that arrive after a reset

  // keep `identity` and the prefetched `next` filled
  useEffect(() => {
    if (s.identity && s.next) return;
    let live = true;
    fetchIdentity().then((identity) => live && dispatch({ type: "IDENTITY_LOADED", identity }));
    return () => { live = false; };
  }, [s.identity, s.next]);

  const send = useCallback((complaint: string) => {
    if (!s.identity) return;
    const v = ++visit.current;
    dispatch({ type: "SEND", complaint });
    sendComplaint(s.identity, complaint).then((reply) => v === visit.current && dispatch({ type: "REPLY_ARRIVED", reply }));
  }, [s.identity]);

  const finish = useCallback(() => { visit.current++; dispatch({ type: "FINISH" }); }, []);
  const post = async () => {
    if (s.wall !== "idle" || !s.reply) return; // never double post
    dispatch({ type: "WALL", wall: "posting" });
    dispatch({ type: "WALL", wall: await postToWall(s.reply.complaintId) });
  };

  useIdleReset(s.phase === "WRITING", () => dispatch({ type: "CLOSE" }));
  useIdleReset(s.phase === "REPLY", finish);

  const postman: PostmanMode =
    s.phase === "SENDING" ? "leave"
    : s.phase === "WAITING" || s.phase === "REPLY" ? "gone"
    : s.returning ? "return" : "idle";

  const exitHow = s.phase === "SENDING" ? "slot" : s.phase === "IDLE" && s.returning ? "left" : "down";
  const cardOpen = s.phase === "WRITING" || s.phase === "REPLY";

  return (
    <Stage>
      <StreetScene />
      <Sign />
      <PostBox enabled={s.phase === "IDLE" && !!s.identity} onOpen={() => dispatch({ type: "OPEN" })} />
      <Postman
        mode={postman}
        onDone={(m) => {
          if (m === "leave") dispatch({ type: "RIDE_DONE" });
          if (m === "return") dispatch({ type: "RETURNED" });
        }}
      />
      {s.phase === "WAITING" && <DistantBell />}

      <AnimatePresence>
        {cardOpen && (
          <motion.div key="dim" className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>
      <AnimatePresence custom={exitHow}>
        {s.phase === "WRITING" && s.identity && (
          <motion.div key="write" className="absolute left-0 right-0 flex justify-center" style={{ top: CARD.top }}
            custom={exitHow} variants={cardVariants} initial="hidden" animate="shown" exit="exit">
            <WritingCard identity={s.identity} onSend={send} onClose={() => dispatch({ type: "CLOSE" })} />
          </motion.div>
        )}
        {s.phase === "REPLY" && s.identity && s.reply && (
          <motion.div key="reply" className="absolute left-0 right-0 flex justify-center" style={{ top: CARD.top }}
            custom={exitHow} variants={cardVariants} initial="hidden" animate="shown" exit="exit">
            <ReplyCard identity={s.identity} complaint={s.complaint} reply={s.reply} wall={s.wall}
              onPost={post} onClose={finish} onWall={() => router.push("/wall")} />
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  );
}
