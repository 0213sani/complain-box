// Warm haze, vignette and paper grain over the whole scene.
export default function Atmosphere() {
  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0A63C" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="#E0A63C" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#2A1609" stopOpacity="0" />
          <stop offset="1" stopColor="#2A1609" stopOpacity="0.45" />
        </radialGradient>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.29  0 0 0 0 0.16  0 0 0 0 0.09  0 0 0 0.12 0" />
        </filter>
      </defs>
      <rect width={1600} height={1000} fill="url(#haze)" />
      <rect width={1600} height={1000} fill="url(#vignette)" />
      <rect width={1600} height={1000} filter="url(#grain)" />
    </g>
  );
}
