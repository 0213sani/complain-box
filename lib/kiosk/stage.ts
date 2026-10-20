// Fixed stage coordinates (px on the 1600x1000 stage).
export const STAGE = { w: 1600, h: 1000, ground: 930 };

// Post box image is 1170x1539; its slot spans ~x 32-68%, y 15-31% of the image.
// ~1.3m box next to a ~1.75m man on a cycle
export const POSTBOX = { left: 470, height: 360, slot: { x: 0.5, y: 0.23 } };
export const postboxWidth = (POSTBOX.height * 1170) / 1539;
export const postboxTop = STAGE.ground - POSTBOX.height;
export const slotCenter = {
  x: POSTBOX.left + postboxWidth * POSTBOX.slot.x,
  y: postboxTop + POSTBOX.height * POSTBOX.slot.y,
};

// Full-screen card position.
export const CARD = { w: 1300, top: 24 };
export const cardHeight = (CARD.w * 750) / 1156;
export const cardLeft = (STAGE.w - CARD.w) / 2;
export const cardCenter = { x: cardLeft + CARD.w / 2, y: CARD.top + cardHeight / 2 };

export const POSTMAN = { left: 840, w: 416, h: 480 }; // sprite viewBox 520x600 drawn at 0.8, wheels on the ground
