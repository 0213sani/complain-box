// Fixed stage coordinates (px on the 1600x1000 stage).
export const STAGE = { w: 1600, h: 1000 };

// Background street_tq.webp (1472x720) drawn to fill the stage height, centred, sides cropped.
export const BG = { w: (1000 * 1472) / 720, h: 1000 };
export const bgLeft = (STAGE.w - BG.w) / 2;
const k = BG.h / 720; // image px -> stage px
const fromImage = (x: number, y: number) => ({ x: x * k + bgLeft, y: y * k });

// The pillar box painted in the image (image px: x 380-482, y 450-715; slot ~ (432, 518)).
const boxTL = fromImage(380, 450), boxBR = fromImage(482, 715);
export const POSTBOX = { left: boxTL.x, top: boxTL.y, w: boxBR.x - boxTL.x, h: boxBR.y - boxTL.y };
export const slotCenter = fromImage(432, 518);

// Full-screen card position.
export const CARD = { w: 1300, top: 24 };
export const cardHeight = (CARD.w * 750) / 1156;
export const cardLeft = (STAGE.w - CARD.w) / 2;
export const cardCenter = { x: cardLeft + CARD.w / 2, y: CARD.top + cardHeight / 2 };
