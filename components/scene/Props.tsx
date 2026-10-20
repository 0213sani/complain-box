import { P, rng } from "./palette";

// Red tarp canopy over a fruit cart, on the left.
export function FruitStall() {
  const r = rng(5);
  const fruit = ["#E8B830", "#E07A2A", "#F0C850", "#7FA040"];
  return (
    <g>
      {/* tarp */}
      <path d="M-30 300 L330 330 L350 420 L-30 400 Z" fill={P.wall} />
      <path d="M-30 380 L345 405 L350 420 L-30 400 Z" fill={P.wallDark} />
      {[40, 120, 200, 280].map((x) => <path key={x} d={`M${x} ${306 + x * 0.08} L${x + 10} ${398 + x * 0.06}`} stroke={P.wallDeep} strokeWidth={4} opacity={0.6} />)}
      <path d="M-30 400 L350 420 L350 440 L-30 470 Z" fill={P.dark} opacity={0.18} />
      {[20, 318].map((x) => <rect key={x} x={x} y={410} width={8} height={400} fill={P.woodDark} />)}
      {/* cart */}
      <path d="M40 812 L360 790 L380 798 L60 822 Z" fill={P.dark} opacity={0.25} />
      <rect x={30} y={690} width={250} height={22} fill={P.wood} />
      <rect x={30} y={690} width={250} height={5} fill="#946038" />
      <rect x={40} y={712} width={10} height={90} fill={P.woodDark} />
      <rect x={260} y={712} width={10} height={90} fill={P.woodDark} />
      <circle cx={150} cy={770} r={34} fill="none" stroke={P.woodDark} strokeWidth={8} />
      <circle cx={150} cy={770} r={6} fill={P.woodDark} />
      {Array.from({ length: 34 }, (_, i) => {
        const row = Math.floor(i / 12);
        return <circle key={i} cx={46 + (i % 12) * 19 + row * 9 + r() * 4} cy={680 - row * 14 - r() * 4} r={10 + r() * 3} fill={fruit[(i + row) % 4]} stroke={P.ink} strokeWidth={1} />;
      })}
    </g>
  );
}

export function Bench({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 72} L${x + w} ${y + 72} L${x + w + 120} ${y + 58} L${x + 110} ${y + 58} Z`} fill={P.dark} opacity={0.25} />
      <rect x={x} y={y} width={w} height={16} fill={P.wood} />
      <rect x={x} y={y} width={w} height={4} fill="#946038" />
      <rect x={x + 10} y={y + 16} width={10} height={56} fill={P.woodDark} />
      <rect x={x + w - 20} y={y + 16} width={10} height={56} fill={P.woodDark} />
    </g>
  );
}

export function Sacks({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 40} ${y} q-6 -70 30 -80 q40 -6 46 80 z`} fill={P.kraft} />
      <path d={`M${x} ${y} q-4 -70 6 -80 q40 -6 30 80 z`} fill="#C8A866" />
      <path d={`M${x + 20} ${y} q-6 -50 30 -56 q36 2 34 56 z`} fill="#D9BC7C" />
    </g>
  );
}

export function Wires() {
  return (
    <g stroke={P.dark} strokeWidth={2.5} fill="none">
      <path d="M0 110 Q 700 190 1600 70" />
      <path d="M0 140 Q 600 230 1600 120" opacity={0.7} />
    </g>
  );
}
