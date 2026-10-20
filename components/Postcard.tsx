import { postcardLayout as L } from "@/lib/postcardLayout";
import type { Identity } from "@/lib/kiosk/machine";
import Typed from "./Typed";

const pct = (v: number) => `${v}%`;

// The real postcard PNG; children are positioned in % of the card.
export function PostcardBase({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: L.aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/postcard_tq.png" alt="" draggable={false} className="absolute inset-0 h-full w-full select-none" />
      {children}
    </div>
  );
}

// Identity on the 3 address lines + 6 PIN boxes. `typed` writes it in (under 2s).
export function Address({ identity, typed }: { identity: Identity; typed: boolean }) {
  const lines = [identity.title, identity.dept, identity.place];
  const t = [
    { delay: 300, ms: 500 },
    { delay: 800, ms: 450 },
    { delay: 1250, ms: 400 },
  ];
  const boxW = L.pinBoxes.w / L.pinBoxes.count;
  return (
    <>
      {L.addressLines.map((line, i) => (
        <div
          key={i}
          className="absolute overflow-hidden whitespace-nowrap font-hand text-[28px] leading-none text-ink"
          style={{ left: pct(line.x + 0.8), width: pct(line.w - 1), bottom: pct(100 - line.y + 1) }}
        >
          {typed ? <Typed text={lines[i]} {...t[i]} /> : lines[i]}
        </div>
      ))}
      {Array.from(identity.pin).map((d, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center font-hand text-[34px] text-ink"
          style={{ left: pct(L.pinBoxes.x + i * boxW), width: pct(boxW), top: pct(L.pinBoxes.y), height: pct(L.pinBoxes.h) }}
        >
          {typed ? <Typed text={d} ms={1} delay={1650 + i * 50} /> : d}
        </div>
      ))}
    </>
  );
}

export const writingAreaStyle = {
  left: pct(L.writingArea.x),
  top: pct(L.writingArea.y),
  width: pct(L.writingArea.w),
  height: pct(L.writingArea.h),
};
