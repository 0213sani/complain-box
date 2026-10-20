"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { POSTMAN, STAGE } from "@/lib/kiosk/stage";
import PostmanSprite from "./PostmanSprite";
import Dust from "./Dust";

export type PostmanMode = "idle" | "leave" | "gone" | "return";

const OFF = STAGE.w - POSTMAN.left + 60; // fully past the right edge
const REAR_WHEEL = 118 * (POSTMAN.w / 520); // stage px of the rear wheel inside the box

// idle: bell + foot tap loop. leave: bell, then ~2s ride off right. return: mirrored ride in from the right.
export default function Postman({ mode, onDone }: { mode: PostmanMode; onDone: (m: PostmanMode) => void }) {
  const [scope, animate] = useAnimate(); // moves along x
  const flip = useRef<HTMLDivElement>(null); // mirrors the sprite only, so the shadow keeps falling right
  const [riding, setRiding] = useState(false);
  const [ringKey, setRingKey] = useState(0);
  const [puff, setPuff] = useState<{ key: number; x: number; dir: 1 | -1 } | null>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let cancelled = false;
    const el = scope.current;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      if (mode === "idle") {
        setRiding(false);
        animate(el, { x: 0, opacity: 1 }, { duration: 0 });
        if (flip.current) animate(flip.current, { scaleX: 1 }, { duration: 0 });
      } else if (mode === "gone") {
        setRiding(false);
        animate(el, { x: OFF, opacity: 0 }, { duration: 0 });
      } else if (mode === "leave") {
        await wait(500); // card goes into the slot first
        if (cancelled) return;
        setRingKey((k) => k + 1);
        await wait(350);
        if (cancelled) return;
        setRiding(true);
        setPuff({ key: Date.now(), x: REAR_WHEEL, dir: -1 });
        await animate(el, { x: OFF }, { duration: 2, ease: [0.5, 0, 0.9, 0.6] });
        if (cancelled) return;
        setRiding(false);
        done.current("leave");
      } else if (mode === "return") {
        if (flip.current) animate(flip.current, { scaleX: -1 }, { duration: 0 });
        await animate(el, { x: OFF, opacity: 1 }, { duration: 0 });
        if (cancelled) return;
        setRiding(true);
        await animate(el, { x: 0 }, { duration: 2, ease: [0.1, 0.4, 0.4, 1] });
        if (cancelled) return;
        setRiding(false);
        setPuff({ key: Date.now(), x: POSTMAN.w - REAR_WHEEL, dir: 1 });
        if (flip.current) animate(flip.current, { scaleX: 1 }, { duration: 0 });
        done.current("return");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, animate, scope]);

  return (
    <div className="pointer-events-none absolute" style={{ left: POSTMAN.left, top: STAGE.ground - POSTMAN.h, width: POSTMAN.w, height: POSTMAN.h }}>
      {puff && <Dust key={puff.key} x={puff.x} dir={puff.dir} />}
      <div ref={scope} className="absolute inset-0">
        {/* cast shadow: sun from the upper left, falls to the right */}
        <svg className="absolute inset-0 overflow-visible" viewBox={`0 0 ${POSTMAN.w} ${POSTMAN.h}`} width={POSTMAN.w} height={POSTMAN.h} aria-hidden>
          <path d={`M20 ${POSTMAN.h - 2} L400 ${POSTMAN.h - 2} L540 ${POSTMAN.h - 30} L330 ${POSTMAN.h - 40} L250 ${POSTMAN.h - 34} L150 ${POSTMAN.h - 28} Z`} fill="#2A1609" opacity={0.3} />
        </svg>
        <div ref={flip} className="absolute inset-0">
          <PostmanSprite riding={riding} idle={mode === "idle"} ringKey={ringKey} />
        </div>
      </div>
    </div>
  );
}
