import {
  curry, map, when, equals,
} from 'ramda';

export const alterByIndex = curry((f, idx, items) => items.map((el, i) => when(() => idx === i, () => f(el), el)));
