import { range } from 'ramda';

export const createAframeElements = (number, color, afShape, [x, y, z]) => range(0, number)
  .map((el, i) => ({
    Shape: `a-${afShape.tag}`,
    ...afShape.defaultAttrs,
    color,
    position: [x, y + i, z].join(' '),
  }));
