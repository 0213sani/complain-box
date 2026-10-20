// Postman on a roadster bicycle, facing right. viewBox 520x600, wheels touch y=598.
// No text anywhere: the sprite is mirrored for the ride back.
const K = { ink: "#1E1410", khaki: "#C49A55", khakiDark: "#9E7A3E", skin: "#8D5232", skinDark: "#6E3E24", brick: "#D8342B", maroon: "#8E1F1B", ochre: "#E0A63C", cream: "#F3E3C0", steel: "#8A7A6A" };

function Wheel({ cx, spin }: { cx: number; spin: boolean }) {
  return (
    <g className={spin ? "pm-spin" : undefined}>
      <circle cx={cx} cy={506} r={88} fill="none" stroke={K.ink} strokeWidth={11} />
      <circle cx={cx} cy={506} r={80} fill="none" stroke={K.steel} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={cx} y1={506} x2={cx + 80 * Math.cos(a)} y2={506 + 80 * Math.sin(a)} stroke={K.steel} strokeWidth={2} />;
      })}
      <circle cx={cx} cy={506} r={9} fill={K.ink} />
    </g>
  );
}

const mudguard = (cx: number) => `M${cx - 98} ${506} A98 98 0 0 1 ${cx + 69} ${437}`;

export default function PostmanSprite({ riding, idle, ringKey }: { riding: boolean; idle: boolean; ringKey: number }) {
  const bellClass = idle ? "pm-bell-idle" : ringKey ? "pm-bell-once" : undefined;
  const ringClass = idle ? "pm-ring-idle" : ringKey ? "pm-ring-once" : undefined;
  return (
    <svg viewBox="0 0 520 600" width="100%" height="100%" className="overflow-visible" aria-hidden>
      <ellipse cx={262} cy={597} rx={236} ry={9} fill={K.ink} opacity={0.25} />

      {/* far leg: foot on the ground when idle, on the pedal when riding */}
      {riding ? (
        <g className="pm-leg-b">
          <path d="M226 318 L298 404 L262 532" stroke={K.khakiDark} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M248 524 h42 q8 0 8 10 v6 h-54 z" fill={K.ink} />
        </g>
      ) : (
        <g>
          <path d="M226 318 L296 410 L300 580" stroke={K.khakiDark} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <g className={idle ? "pm-tap" : undefined}>
            <path d="M286 578 h40 q10 0 10 12 v8 h-54 z" fill={K.ink} />
          </g>
        </g>
      )}
      {/* far arm */}
      <path d="M262 204 L302 252 L324 290" stroke={K.khakiDark} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <Wheel cx={118} spin={riding} />
      <Wheel cx={402} spin={riding} />
      <path d={mudguard(118)} stroke={K.ink} strokeWidth={8} fill="none" />
      <path d={mudguard(402)} stroke={K.ink} strokeWidth={8} fill="none" />

      {/* frame */}
      <g stroke={K.ink} strokeWidth={11} strokeLinecap="round" fill="none">
        <path d="M238 506 L208 318" />
        <path d="M214 346 L372 338" />
        <path d="M238 506 L380 378" />
        <path d="M238 506 L118 506" />
        <path d="M214 346 L118 506" />
        <path d="M372 336 L380 380 Q392 450 402 506" />
        <path d="M372 338 L366 300 Q360 286 330 290" />
        <path d="M214 364 L52 372 M70 372 L118 506" strokeWidth={7} />
      </g>
      <circle cx={238} cy={506} r={22} fill="none" stroke={K.ink} strokeWidth={6} />

      {/* mail bag on the carrier */}
      <rect x={48} y={306} width={150} height={70} rx={10} fill={K.maroon} />
      <rect x={40} y={298} width={150} height={70} rx={10} fill={K.brick} />
      <rect x={46} y={336} width={140} height={28} rx={6} fill={K.maroon} opacity={0.45} />
      <path d="M40 308 Q40 298 50 298 H180 Q190 298 190 308 V326 Q115 350 40 326 Z" fill={K.maroon} />
      <rect x={108} y={318} width={14} height={18} rx={2} fill={K.ochre} />

      {/* saddle */}
      <path d="M178 312 Q210 298 242 310 L238 322 Q205 318 180 324 Z" fill={K.ink} />

      {/* near leg (on the pedal) */}
      <g className={riding ? "pm-leg-a" : undefined}>
        <path d="M228 318 L304 396 L270 528" stroke={K.khaki} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M256 520 h42 q8 0 8 10 v6 h-54 z" fill={K.ink} />
      </g>

      {/* upper body bobs while riding */}
      <g className={riding ? "pm-bob" : undefined}>
        <path d="M205 325 C200 270 215 220 248 188 L300 180 C318 220 302 270 282 305 L262 338 Z" fill={K.khaki} />
        <path d="M205 325 C200 270 215 220 248 188 L262 190 C232 228 222 272 226 330 Z" fill="#DDBB78" />
        <path d="M300 180 C318 220 302 270 282 305 L262 338 L248 330 C272 290 290 240 284 183 Z" fill={K.khakiDark} opacity={0.75} />
        <path d="M208 316 L268 324" stroke={K.maroon} strokeWidth={10} />
        <path d="M292 186 L212 318" stroke={K.maroon} strokeWidth={9} strokeLinecap="round" />
        {[214, 240, 266].map((y, i) => <circle key={y} cx={294 - i * 6} cy={y} r={4} fill={K.ochre} />)}
        {/* neck + head */}
        <path d="M274 188 L298 182 L294 156 L276 158 Z" fill={K.skin} />
        <circle cx={292} cy={132} r={34} fill={K.skin} />
        <path d="M292 98 A34 34 0 0 1 292 166 A24 34 0 0 0 292 98 Z" fill={K.skinDark} opacity={0.55} />
        <circle cx={274} cy={138} r={7} fill={K.skinDark} />
        <path d="M322 124 q10 8 0 16" fill={K.skin} stroke={K.skinDark} strokeWidth={2} />
        <circle cx={309} cy={126} r={3.5} fill={K.ink} />
        <path d="M301 116 l14 -2" stroke={K.ink} strokeWidth={3} strokeLinecap="round" />
        <path d="M296 148 q14 -8 28 0 q-12 10 -28 0 z" fill={K.ink} />
        <path d="M258 122 q-4 18 6 30 l6 -2 q-6 -12 -2 -26 z" fill={K.ink} />
        {/* cap */}
        <path d="M256 118 Q258 84 294 82 Q332 84 332 114 Z" fill={K.khaki} />
        <path d="M262 112 Q264 90 290 86 Q272 96 272 112 Z" fill="#DDBB78" />
        <rect x={256} y={106} width={76} height={12} fill={K.maroon} />
        <circle cx={300} cy={98} r={6} fill={K.ochre} />
        <path d="M324 114 L356 120 Q342 128 318 124 Z" fill={K.ink} />
        {/* near arm + hand on the grip */}
        <path d="M284 198 L318 252 L330 288" stroke={K.khaki} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={330} cy={290} r={11} fill={K.skin} />
      </g>

      {/* bell on the handlebar */}
      <g key={ringKey} className={bellClass}>
        <path d="M344 290 q0 -16 10 -16 q10 0 10 16 z" fill={K.ochre} stroke={K.ink} strokeWidth={3} />
        <rect x={352} y={290} width={4} height={8} fill={K.ink} />
      </g>
      <g key={`r${ringKey}`} className={ringClass} opacity={0} stroke={K.ink} strokeWidth={3} strokeLinecap="round" fill="none">
        <path d="M372 270 q8 9 0 18" />
        <path d="M382 262 q14 17 0 34" />
      </g>
    </svg>
  );
}
