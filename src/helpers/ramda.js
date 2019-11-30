import {
  curry, when,
} from 'ramda';

export const alterByIndex = curry((f, idx, items) => items.map((el, i) => when(() => idx === i, () => f(el), el)));
