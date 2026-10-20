// Measured on public/assets/postcard_tq.png (1156x750, cropped). All values are % of the card.
export const postcardLayout = {
  aspect: 1156 / 750,
  writingArea: { x: 3, y: 10, w: 43, h: 80 },
  // y = the printed line; text sits just above it
  addressLines: [41.6, 51.7, 61.7].map((y) => ({ x: 52.6, y, w: 43.4 })),
  pinBoxes: { x: 59.3, y: 76.1, w: 36.7, h: 7.1, count: 6 },
  stamp: { x: 80, y: 4, w: 16, h: 22 }, // keep clear
} as const;
