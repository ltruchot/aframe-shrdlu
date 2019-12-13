import {
  curry, when, map, addIndex, all, forEach, pipe, find, not,
  prop, reduce, max, equals, filter, identity,
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

export const isNested = pipe(find(Array.isArray), Boolean);
export const isFlat = pipe(isNested, not);
export const containsFlat = all(isFlat);
export const indexedForEach = addIndex(forEach);
export const indexedAll = addIndex(all);
export const indexedFind = addIndex(find);
export const compact = filter(identity);


export const findBy = curry((k, val) => find(pipe(prop(k), equals(val))));
export const maxLength = reduce((acc, cur) => max(acc, cur.length), -Infinity);
export const firstReal = find(Boolean);
