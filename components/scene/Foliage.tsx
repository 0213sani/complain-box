import { P, rng } from "./palette";

// Tree canopy hanging into the top-left corner.
export function Canopy() {
  const r = rng(11);
  const tones = [P.leafDeep, P.leaf, P.leafMid, P.leafLit];
  return (
    <g>
      <path d="M120 260 C130 180 150 120 190 60" stroke={P.woodDark} strokeWidth={22} fill="none" />
      <path d="M160 120 C220 100 280 70 330 30" stroke={P.woodDark} strokeWidth={12} fill="none" />
      {Array.from({ length: 70 }, (_, i) => {
        const t = i / 70;
        const cx = -40 + r() * 470 * (1 - t * 0.3);
        const cy = -40 + r() * 220 * (1 - (cx / 470) * 0.6);
        return <circle key={i} cx={cx} cy={cy} r={22 + r() * 42} fill={tones[Math.min(3, Math.floor(t * 4.5 * r() + (cy < 60 ? 1 : 0)))]} />;
      })}
      {/* sunlit leaf tips on the upper left */}
      {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={r() * 300} cy={r() * 90 - 20} r={10 + r() * 16} fill={P.leafLit} opacity={0.8} />)}
    </g>
  );
}

function Leaf({ x, y, len, angle, tone }: { x: number; y: number; len: number; angle: number; tone: string }) {
  const w = len * 0.24;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 C${len * 0.3} ${-w} ${len * 0.75} ${-w * 0.9} ${len} ${-w * 0.15} C${len * 0.7} ${w * 0.5} ${len * 0.3} ${w * 0.55} 0 0 Z`} fill={tone} />
      <path d={`M0 0 C${len * 0.4} ${-w * 0.15} ${len * 0.75} ${-w * 0.2} ${len} ${-w * 0.15}`} stroke={P.leafDeep} strokeWidth={3} fill="none" opacity={0.6} />
      {[0.3, 0.5, 0.7].map((k) => <path key={k} d={`M${len * k} ${-w * 0.1} l${len * 0.05} ${-w * 0.7}`} stroke={P.sky} strokeWidth={3} opacity={0.5} />)}
    </g>
  );
}

// Dense banana plants on the right.
export function Bananas() {
  const plants = [
    { x: 1210, top: 430, s: 1 },
    { x: 1330, top: 360, s: 1.15 },
    { x: 1470, top: 400, s: 1.05 },
  ];
  const tones = [P.leafDeep, P.leaf, P.leafMid, P.leafLit];
  return (
    <g>
      {plants.map((p, i) => (
        <g key={i}>
          <path d={`M${p.x - 14} 820 L${p.x - 6} ${p.top} L${p.x + 10} ${p.top} L${p.x + 18} 820 Z`} fill={P.stem} />
          <path d={`M${p.x + 4} 820 L${p.x + 4} ${p.top} L${p.x + 10} ${p.top} L${p.x + 18} 820 Z`} fill={P.leaf} opacity={0.4} />
          {[-160, -125, -95, -60, -30, 10, 40].map((a, k) => (
            <Leaf key={k} x={p.x + 2} y={p.top + 10 + (k % 3) * 18} len={(170 + (k % 3) * 40) * p.s} angle={a} tone={tones[(k + i) % 4]} />
          ))}
        </g>
      ))}
    </g>
  );
}
