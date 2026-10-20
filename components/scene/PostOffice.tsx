import { P, rng } from "./palette";

const WALL = { x: 190, y: 40, w: 950, base: 805 };
const SHOP = { x: 600, y: 330, w: 510 }; // opening under the awning

function Plaster() {
  // patchy, weathered paint in several reds, plus spots of exposed brick
  const r = rng(7);
  const tones = [P.wall, P.wallLit, "#C92E26", P.wallDark, "#DD3F30"];
  return (
    <g>
      {Array.from({ length: 140 }, (_, i) => {
        const w = 24 + r() * 110, h = 8 + r() * 46;
        return <rect key={i} x={WALL.x + r() * (WALL.w - 40)} y={WALL.y + r() * 740} width={w} height={h} fill={tones[i % tones.length]} opacity={0.45 + r() * 0.5} />;
      })}
      {[[230, 560, 120, 70], [470, 120, 90, 50], [1020, 600, 90, 90], [330, 700, 80, 50], [960, 90, 110, 60]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={P.brick} />
          {Array.from({ length: Math.floor(h / 12) }, (_, k) => (
            <g key={k}>
              <rect x={x} y={y + k * 12 + 10} width={w} height={2} fill={P.brickLine} />
              {Array.from({ length: Math.floor(w / 28) }, (_, j) => (
                <rect key={j} x={x + j * 28 + (k % 2) * 14} y={y + k * 12} width={2} height={10} fill={P.brickLine} />
              ))}
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function Interior() {
  const cols = 9, rows = 4, cw = 50, ch = 40, x0 = 690, y0 = 380;
  const r = rng(3);
  return (
    <g>
      <rect x={SHOP.x} y={SHOP.y} width={SHOP.w} height={WALL.base - SHOP.y} fill={P.dark} />
      <rect x={SHOP.x + 20} y={SHOP.y + 20} width={SHOP.w - 40} height={430} fill={P.interior} />
      {/* pigeonholes with letters */}
      <rect x={x0 - 10} y={y0 - 10} width={cols * cw + 20} height={rows * ch + 20} fill={P.woodDark} />
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = x0 + (i % cols) * cw, cy = y0 + Math.floor(i / cols) * ch;
        const has = r() > 0.3;
        return (
          <g key={i}>
            <rect x={cx + 3} y={cy + 3} width={cw - 6} height={ch - 6} fill={P.dark} />
            {has && <rect x={cx + 8} y={cy + 14 + r() * 6} width={cw - 16} height={14} fill={[P.cream, P.kraft, P.cream, P.terra][i % 4]} transform={`rotate(${r() * 10 - 5} ${cx + cw / 2} ${cy + ch / 2})`} />}
          </g>
        );
      })}
      {/* hanging bulb + warm glow */}
      <line x1={880} y1={330} x2={880} y2={360} stroke={P.ink} strokeWidth={2} />
      <circle cx={880} cy={366} r={8} fill={P.kraft} />
      <circle cx={880} cy={366} r={60} fill={P.ochre} opacity={0.12} />
      {/* parcels + counter */}
      {[[640, 640, 60, 44, P.kraft], [700, 650, 40, 34, P.cream], [1020, 630, 70, 54, P.kraft], [1050, 600, 40, 30, P.terra]].map(([x, y, w, h, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} stroke={P.ink} strokeWidth={2} />
      ))}
      <rect x={SHOP.x + 10} y={690} width={SHOP.w - 20} height={115} fill={P.wood} />
      <rect x={SHOP.x + 10} y={690} width={SHOP.w - 20} height={14} fill="#946038" />
      <rect x={SHOP.x + 10} y={760} width={SHOP.w - 20} height={45} fill={P.woodDark} />
      {/* sunlight patch falling into the shop */}
      <path d={`M${SHOP.x} 520 L${SHOP.x + 160} 520 L${SHOP.x + 260} 805 L${SHOP.x} 805 Z`} fill={P.ochre} opacity={0.1} />
    </g>
  );
}

function Awning() {
  const x0 = 170, x1 = 1170, y = 288, h = 42;
  return (
    <g>
      {/* shadow it throws on the wall and the shop */}
      <path d={`M${WALL.x} ${y + h} H${x1 - 30} L${x1 - 30} ${y + h + 70} H${WALL.x} Z`} fill={P.dark} opacity={0.35} />
      <rect x={x0} y={y} width={x1 - x0} height={h} fill={P.tin} />
      {Array.from({ length: Math.floor((x1 - x0) / 16) }, (_, i) => (
        <rect key={i} x={x0 + i * 16} y={y} width={7} height={h} fill={i % 3 === 0 ? P.tinLit : P.tinDark} opacity={0.7} />
      ))}
      {/* rust streaks */}
      {[260, 410, 700, 930, 1080].map((x) => <rect key={x} x={x} y={y} width={30} height={h} fill={P.brick} opacity={0.35} />)}
      <path d={`M${x0} ${y + h} ${Array.from({ length: Math.floor((x1 - x0) / 16) + 1 }, (_, i) => `L${x0 + i * 16} ${y + h + (i % 2 ? 8 : 0)}`).join(" ")} L${x1} ${y + h} Z`} fill={P.tinDark} />
      {[220, 560, 1120].map((x) => <rect key={x} x={x} y={y + h} width={8} height={30} fill={P.ink} />)}
    </g>
  );
}

// The red post office front: the scene's hero, like the reference's red salon wall.
export default function PostOffice() {
  return (
    <g>
      <clipPath id="wallClip"><rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.base - WALL.y} /></clipPath>
      <rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.base - WALL.y} fill={P.wall} />
      <g clipPath="url(#wallClip)">
        <Plaster />
        {/* painted sign, weathered */}
        <text x={680} y={235} textAnchor="middle" style={{ fontFamily: "var(--font-rozha)" }} fontSize={190} fill={P.cream}>डाक घर</text>
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={430 + ((i * 97) % 500)} y={80 + ((i * 53) % 160)} width={14 + (i % 4) * 6} height={6} fill={P.wall} opacity={0.3} />)}
        {/* big diagonal shadow from the tree and the building on the left */}
        <path d="M190 40 H560 L390 330 L190 560 Z" fill={P.wallDeep} opacity={0.45} />
        {/* lit right edge */}
        <path d="M1060 40 H1140 V805 H1100 Z" fill={P.wallLit} opacity={0.35} />
      </g>
      {/* parapet with a cream trim */}
      <rect x={WALL.x - 12} y={WALL.y - 26} width={WALL.w + 24} height={30} fill={P.wallDark} />
      <rect x={WALL.x - 12} y={WALL.y - 4} width={WALL.w + 24} height={8} fill={P.cream} opacity={0.8} />
      <rect x={WALL.x + WALL.w} y={WALL.y} width={20} height={WALL.base - WALL.y} fill={P.wallDeep} />
      <Interior />
      <Awning />
      {/* notice pasted on the wall */}
      <g transform="rotate(-3 300 620)">
        <rect x={250} y={590} width={110} height={130} fill={P.cream} opacity={0.85} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={262} y={606 + i * 16} width={i % 2 ? 70 : 86} height={5} fill={P.ink} opacity={0.5} />)}
      </g>
      {/* wall base: damp line */}
      <rect x={WALL.x} y={760} width={WALL.w} height={45} fill={P.wallDeep} opacity={0.45} />
    </g>
  );
}
