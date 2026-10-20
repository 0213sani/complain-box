import { P } from "./palette";

// Far layer: sky, hazy pink buildings on the right, salmon building on the left.
export default function Backdrop() {
  return (
    <g>
      <rect width={1600} height={820} fill={P.sky} />
      {/* far right: pink buildings in haze */}
      <rect x={1130} y={70} width={480} height={750} fill={P.pink} />
      <rect x={1130} y={70} width={60} height={750} fill={P.pinkDark} />
      <rect x={1330} y={40} width={280} height={40} fill={P.pinkHaze} />
      <rect x={1380} y={20} width={44} height={36} fill={P.dark} opacity={0.6} />
      <rect x={1520} y={10} width={50} height={40} fill={P.dark} opacity={0.6} />
      <rect x={1200} y={130} width={380} height={10} fill={P.pinkDark} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={1210 + i * 27} y={100} width={5} height={32} fill={P.ink} opacity={0.6} />)}
      {[[1230, 180], [1360, 180], [1490, 180], [1230, 330], [1360, 330], [1490, 330]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width={70} height={100} fill={P.pinkDark} />
          <rect x={x + 8} y={y + 8} width={54} height={92} fill={P.dark} opacity={0.75} />
          <rect x={x + 8} y={y + 8} width={54} height={30} fill={P.teal} opacity={0.5} />
        </g>
      ))}
      {/* left: salmon building behind the tree */}
      <rect x={-10} y={120} width={220} height={700} fill={P.salmon} />
      <rect x={170} y={120} width={40} height={700} fill={P.salmonDark} />
      <rect x={30} y={430} width={90} height={130} fill={P.dark} />
      <rect x={20} y={430} width={20} height={130} fill={P.teal} />
      <rect x={110} y={430} width={20} height={130} fill={P.teal} />
      <rect x={20} y={560} width={110} height={10} fill={P.cream} />
      {/* haze over the far layer */}
      <rect x={1130} y={0} width={470} height={820} fill={P.pinkHaze} opacity={0.18} />
    </g>
  );
}
