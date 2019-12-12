import {
  curry, when, map, addIndex,
} from 'ramda';

export const mapIndexed = addIndex(map);

export const alterByIndex = curry((f, idx, items) => mapIndexed(
  (el, i) => when(
    () => idx === i,
    () => f(el),
    el,
  ),
  items,
));
