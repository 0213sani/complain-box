import { P, rng } from "./palette";

// Dusty street with patches, contact shadow along the wall, and the post box's cast shadow.
export default function Ground() {
  const r = rng(19);
  return (
    <g>
      <rect y={800} width={1600} height={200} fill={P.ground} />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={r() * 1600} y={810 + r() * 180} width={30 + r() * 140} height={4 + r() * 10} fill={i % 3 ? P.groundLit : P.groundDark} opacity={0.5} />
      ))}
      <rect y={800} width={1600} height={22} fill={P.dark} opacity={0.3} />
      {/* post box shadow (light from upper left -> shadow falls right) */}
      <path d="M520 930 L700 930 L860 900 L690 896 Z" fill={P.dark} opacity={0.32} />
      <ellipse cx={607} cy={930} rx={100} ry={8} fill={P.dark} opacity={0.35} />
    </g>
  );
}
