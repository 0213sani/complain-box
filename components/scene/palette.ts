// Scene colours. Light comes from the upper left: *Lit is the sunny face, *Dark the shadow face.
export const P = {
  sky: "#8DB4D4",
  wall: "#D8342B", wallLit: "#E5523F", wallDark: "#A82620", wallDeep: "#7E1A16",
  brick: "#B85A3C", brickLine: "#8E3B26",
  pink: "#D98A7E", pinkDark: "#B8685E", pinkHaze: "#E7B3A0",
  salmon: "#D98B6A", salmonDark: "#B76A4E",
  cream: "#F3E3C0", kraft: "#E9C987", ochre: "#E0A63C", terra: "#E0704A", maroon: "#8E1F1B",
  ink: "#4A2A17", dark: "#2A1609", interior: "#3A2216",
  tin: "#8C7A6B", tinDark: "#5E5046", tinLit: "#A8968A",
  wood: "#7A4A2A", woodDark: "#5A3420",
  leaf: "#2F5D3A", leafMid: "#3F7A4C", leafLit: "#6E9B4A", leafDeep: "#1F3F28", stem: "#9DB06A",
  ground: "#BF9470", groundLit: "#D2A983", groundDark: "#9C7454",
  teal: "#1F6F78", indigo: "#23305E", skin: "#8D5232", skinDark: "#6E3E24",
};

// Deterministic random so the scene looks the same on every load.
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
