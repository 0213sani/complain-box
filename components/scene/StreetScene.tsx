import { memo } from "react";

// Static street backdrop, 1600x1000. Flat vector, solid block shadows, light from the left.
const C = {
  sky: "#F0B95A", far: "#E8955A", brick: "#D8342B", maroon: "#8E1F1B", terra: "#E0704A", ochre: "#E0A63C",
  cream: "#F3E3C0", kraft: "#E9C987", ink: "#4A2A17", dark: "#2A1609", teal: "#1F6F78", indigo: "#23305E", leaf: "#2F5D3A", leafLight: "#3F7A4C",
};

function ArchWindow({ x, y, w, h, shutters = C.teal }: { x: number; y: number; w: number; h: number; shutters?: string }) {
  const r = w / 2;
  const arch = `M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z`;
  return (
    <g>
      <path d={arch} transform="translate(8 8)" fill={C.maroon} opacity={0.55} />
      <path d={arch} fill={C.cream} />
      <path d={`M${x + 8} ${y + h - 8} V${y + r} A${r - 8} ${r - 8} 0 0 1 ${x + w - 8} ${y + r} V${y + h - 8} Z`} fill={C.dark} />
      <rect x={x - 14} y={y + r - 4} width={16} height={h - r - 4} fill={shutters} />
      <rect x={x + w - 2} y={y + r - 4} width={16} height={h - r - 4} fill={shutters} />
      <rect x={x - 8} y={y + h} width={w + 16} height={10} fill={C.cream} />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x + (w * i) / 4} x2={x + (w * i) / 4} y1={y + r - 10} y2={y + h - 8} stroke={C.ink} strokeWidth={4} />
      ))}
    </g>
  );
}

function Bunting() {
  // flags hanging from a sagging wire (quadratic from (560,190) via (900,260) to (1240,196))
  const P0 = [560, 190], P1 = [900, 262], P2 = [1240, 196];
  const at = (t: number) => [0, 1].map((k) => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k]);
  const colors = [C.brick, C.ochre, C.teal, C.cream, C.leaf, C.terra];
  return (
    <g>
      <path d={`M${P0} Q${P1} ${P2}`} stroke={C.ink} strokeWidth={3} fill="none" />
      {Array.from({ length: 13 }, (_, i) => {
        const [x, y] = at((i + 0.5) / 13);
        return (
          <path key={i} className="bunting" style={{ animationDelay: `${-i * 0.37}s` }}
            d={`M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 38} Z`} fill={colors[i % colors.length]} stroke={C.ink} strokeWidth={2} />
        );
      })}
    </g>
  );
}

function BananaPlant({ x }: { x: number }) {
  const leaf = (d: string, fill: string, i: number) => (
    <g key={i}>
      <path d={d} fill={fill} stroke={C.leaf} strokeWidth={3} />
    </g>
  );
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x={70} y={640} width={26} height={170} fill="#6B4A2A" />
      {leaf("M83 650 C 20 600 -40 520 -60 440 C 10 470 60 560 83 650 Z", C.leafLight, 0)}
      {leaf("M83 640 C 120 560 200 500 260 470 C 230 560 150 620 83 640 Z", C.leaf, 1)}
      {leaf("M83 645 C 60 560 70 460 110 380 C 140 470 120 570 83 645 Z", C.leafLight, 2)}
      {leaf("M83 660 C 150 640 230 650 280 690 C 200 710 130 690 83 660 Z", C.leafLight, 3)}
      {leaf("M83 660 C 20 660 -40 690 -70 730 C 0 735 50 700 83 660 Z", C.leaf, 4)}
      <path d="M40 790 h90 l-10 50 h-70 z" fill={C.terra} stroke={C.ink} strokeWidth={4} />
    </g>
  );
}

function StreetScene() {
  return (
    <svg viewBox="0 0 1600 1000" width={1600} height={1000} className="absolute inset-0" aria-hidden>
      <defs>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.29  0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 0.09 0" />
        </filter>
      </defs>

      {/* sky + far skyline */}
      <rect width={1600} height={820} fill={C.sky} />
      <circle cx={1300} cy={120} r={64} fill={C.cream} opacity={0.55} />
      <path d="M0 260 h120 v-50 h90 v80 h110 v-40 h140 v300 H0 Z M600 300 h80 v-70 h120 v60 h90 v-30 h130 v400 H600 Z M1150 230 h110 v-40 h40 v40 h120 v300 h-270 Z"
        fill={C.far} />
      <rect x={1180} y={160} width={36} height={40} fill={C.far} />
      <ellipse cx={1198} cy={160} rx={18} ry={6} fill={C.far} />

      {/* building A (left, brick) */}
      <rect x={0} y={80} width={600} height={720} fill={C.brick} />
      <rect x={600} y={80} width={22} height={720} fill={C.maroon} />
      <rect x={-10} y={56} width={630} height={30} fill={C.maroon} />
      {Array.from({ length: 21 }, (_, i) => <circle key={i} cx={10 + i * 30} cy={92} r={5} fill={C.cream} />)}
      {[[40, 330], [470, 200], [150, 560], [520, 640], [90, 720], [300, 300]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={44} height={10} fill={C.maroon} opacity={0.35} />
      ))}
      <ArchWindow x={120} y={380} w={120} h={190} />
      <rect x={60} y={620} width={170} height={180} fill={C.maroon} />
      <rect x={72} y={632} width={146} height={168} fill={C.dark} />

      {/* building B (post office shop) */}
      <rect x={620} y={200} width={580} height={600} fill={C.kraft} />
      <rect x={608} y={182} width={604} height={24} fill={C.terra} />
      <rect x={668} y={242} width={490} height={110} fill={C.ink} />
      <rect x={660} y={234} width={490} height={110} fill={C.maroon} stroke={C.cream} strokeWidth={6} />
      <text x={905} y={312} textAnchor="middle" fontFamily="var(--font-rozha)" fontSize={66} fill={C.cream}>डाक घर</text>
      <rect x={650} y={470} width={520} height={330} fill={C.dark} />
      {/* shelves */}
      {[640, 700].map((y) => <rect key={y} x={660} y={y} width={500} height={8} fill={C.ink} />)}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={830 + i * 30} y={(i % 2 ? 612 : 606)} width={22} height={i % 2 ? 28 : 34} fill={[C.ochre, C.terra, C.cream, C.teal][i % 4]} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={840 + i * 34} y={668} width={26} height={32} fill={[C.cream, C.brick, C.ochre][i % 3]} />
      ))}
      {/* half-open shutter */}
      <rect x={650} y={470} width={520} height={120} fill={C.teal} />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={650} y={480 + i * 16} width={520} height={4} fill={C.ink} opacity={0.35} />)}
      <rect x={640} y={740} width={540} height={60} fill={C.maroon} />
      <rect x={640} y={740} width={540} height={10} fill={C.brick} />
      {/* awning */}
      <rect x={630} y={460} width={560} height={14} fill={C.ink} opacity={0.3} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={620 + i * 40} y={382} width={40} height={66} fill={i % 2 ? C.cream : C.brick} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={640 + i * 40} cy={448} r={20} fill={i % 2 ? C.cream : C.brick} />
      ))}
      <rect x={612} y={372} width={576} height={14} fill={C.maroon} />

      {/* building C (right, terracotta) */}
      <rect x={1212} y={30} width={400} height={770} fill={C.terra} />
      <rect x={1200} y={30} width={12} height={770} fill={C.maroon} opacity={0.5} />
      <ArchWindow x={1270} y={90} w={110} h={170} shutters={C.indigo} />
      <ArchWindow x={1450} y={90} w={110} h={170} shutters={C.indigo} />
      <ArchWindow x={1270} y={400} w={110} h={170} />
      <ArchWindow x={1450} y={400} w={110} h={170} />
      {/* balcony */}
      <rect x={1236} y={300} width={360} height={14} fill={C.cream} />
      <rect x={1236} y={314} width={360} height={8} fill={C.maroon} opacity={0.5} />
      <rect x={1236} y={250} width={360} height={6} fill={C.ink} />
      {Array.from({ length: 19 }, (_, i) => <rect key={i} x={1240 + i * 19.5} y={254} width={4} height={46} fill={C.ink} />)}
      {[1300, 1420, 1540].map((x) => (
        <g key={x}>
          <path d={`M${x} 250 h34 l-5 -26 h-24 z`} fill={C.brick} />
          <circle cx={x + 10} cy={214} r={13} fill={C.leaf} />
          <circle cx={x + 25} cy={210} r={11} fill={C.leafLight} />
        </g>
      ))}

      {/* wires + bunting */}
      <path d="M0 150 Q 800 250 1600 140" stroke={C.ink} strokeWidth={3} fill="none" />
      <Bunting />

      <BananaPlant x={1440} />

      {/* footpath, kerb, road */}
      <rect y={790} width={1600} height={14} fill={C.maroon} />
      <rect y={804} width={1600} height={156} fill="#E3BD7A" />
      {Array.from({ length: 21 }, (_, i) => <rect key={i} x={i * 80} y={804} width={3} height={156} fill={C.ink} opacity={0.15} />)}
      <rect y={880} width={1600} height={3} fill={C.ink} opacity={0.15} />
      {Array.from({ length: 27 }, (_, i) => <rect key={i} x={i * 60} y={960} width={60} height={16} fill={i % 2 ? C.ochre : C.ink} />)}
      <rect y={976} width={1600} height={24} fill="#3A2416" />
      {/* post box shadow */}
      <path d="M470 930 L760 930 L800 912 L520 912 Z" fill={C.ink} opacity={0.28} />

      <rect width={1600} height={1000} filter="url(#grain)" />
    </svg>
  );
}

export default memo(StreetScene);
