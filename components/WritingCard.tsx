"use client";
import { useEffect, useRef, useState } from "react";
import type { Identity } from "@/lib/kiosk/machine";
import { Address, PostcardBase, writingAreaStyle } from "./Postcard";
import StampButton from "./StampButton";

const MAX = 160;

export default function WritingCard({ identity, onSend, onClose }: {
  identity: Identity; onSend: (text: string) => void; onClose: () => void;
}) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  // focus without scrolling the clipped stage
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);
  const send = () => text.trim() && onSend(text.trim());

  return (
    <div className="flex flex-col items-center gap-4">
      <PostcardBase className="w-[1300px]">
        <Address identity={identity} typed />
        <textarea
          ref={ref}
          value={text}
          maxLength={MAX}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            } else if (e.key === "Escape") onClose();
          }}
          placeholder="Likho apni shikayat yahaan…"
          className="absolute resize-none bg-transparent font-hand text-[40px] leading-[1.45] text-ink outline-none placeholder:text-ink/35"
          style={writingAreaStyle}
          spellCheck={false}
        />
        <div className="absolute font-ui text-lg text-ink/50" style={{ left: "3%", bottom: "4%" }}>
          {text.length}/{MAX}
        </div>
      </PostcardBase>
      <div className="flex w-[1300px] items-center justify-between">
        <p className="font-ui text-xl text-cream">Enter to send · Shift+Enter for a new line · Esc to close</p>
        <StampButton onClick={send} disabled={!text.trim()}>Send</StampButton>
      </div>
    </div>
  );
}
