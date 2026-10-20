import { P } from "./palette";

type Look = { shirt: string; shirtDark: string; pants: string; pantsDark: string; hair?: string };

function Head({ y }: { y: number }) {
  return (
    <g>
      <rect x={-7} y={y + 16} width={14} height={14} fill={P.skinDark} />
      <circle cx={0} cy={y} r={22} fill={P.skin} />
      <path d={`M2 ${y - 22} A22 22 0 0 1 2 ${y + 22} Z`} fill={P.skinDark} />
      <path d={`M-22 ${y - 2} Q-20 ${y - 25} 0 ${y - 24} Q20 ${y - 25} 22 ${y - 4} Q8 ${y - 12} -22 ${y - 2} Z`} fill={P.dark} />
    </g>
  );
}

// Standing figure, feet at (0,0), ~300 tall at scale 1. Flat two-tone shading, lit from the left.
export function Standing({ x, y, s = 1, look }: { x: number; y: number; s?: number; look: Look }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0 L120 -18 L150 -10 L18 6 Z" fill={P.dark} opacity={0.25} />
      <path d="M-20 -130 L-24 -6 L-8 -6 L-2 -130 Z" fill={look.pants} />
      <path d="M2 -130 L8 -6 L24 -6 L20 -130 Z" fill={look.pantsDark} />
      <rect x={-28} y={-8} width={22} height={8} fill={P.dark} />
      <rect x={6} y={-8} width={24} height={8} fill={P.dark} />
      <path d="M-36 -250 L-46 -110 L0 -104 L0 -252 Z" fill={look.shirt} />
      <path d="M0 -252 L0 -104 L46 -110 L36 -250 Z" fill={look.shirtDark} />
      <path d="M-36 -248 L-52 -150 L-42 -146 L-26 -238 Z" fill={look.shirt} />
      <circle cx={-47} cy={-144} r={7} fill={P.skin} />
      <path d="M36 -248 L52 -150 L42 -146 L26 -238 Z" fill={look.shirtDark} />
      <circle cx={47} cy={-144} r={7} fill={P.skinDark} />
      <Head y={-278} />
    </g>
  );
}

// Seated figure reading a newspaper; seat at (0,0).
export function SeatedReader({ x, y, s = 1, look }: { x: number; y: number; s?: number; look: Look }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-25 -10 L48 -14 L48 8 L-25 10 Z" fill={look.pants} />
      <path d="M30 -4 L34 112 L52 112 L50 -4 Z" fill={look.pantsDark} />
      <rect x={30} y={108} width={30} height={8} fill={P.dark} />
      <path d="M-30 -150 L-34 0 L0 2 L0 -152 Z" fill={look.shirt} />
      <path d="M0 -152 L0 2 L30 0 L28 -150 Z" fill={look.shirtDark} />
      <Head y={-176} />
      {/* newspaper held up */}
      <path d="M-20 -128 L30 -96 L40 -104" stroke={look.shirt} strokeWidth={14} strokeLinecap="round" fill="none" />
      <g transform="rotate(-8 60 -110)">
        <rect x={30} y={-150} width={78} height={64} fill={P.cream} />
        <rect x={68} y={-150} width={40} height={64} fill={P.kraft} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={36} y={-140 + i * 11} width={26} height={4} fill={P.ink} opacity={0.5} />)}
      </g>
    </g>
  );
}

export const LOOKS = {
  white: { shirt: "#EFE6D6", shirtDark: "#C9BBA6", pants: P.indigo, pantsDark: "#18213F" },
  rust: { shirt: P.terra, shirtDark: "#B5553A", pants: P.ink, pantsDark: P.dark },
  cream: { shirt: P.cream, shirtDark: "#CDBB98", pants: "#6B6A5A", pantsDark: "#4C4B3F" },
};
