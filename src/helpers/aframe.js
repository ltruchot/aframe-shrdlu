import { range } from 'ramda';
import { getShapeNames } from '../data/shapes';

export const createAframeElements = (number, color, afShape, [x, y, z], autoid) => range(0, number)
  .map((n) => ({
    Shape: `a-${afShape.tag}`,
    names: getShapeNames(afShape),
    ...afShape.defaultAttrs,
    color,
    position: [x, y + n, z],
    id: autoid + 1 + n,
  }));
