import {
  dropLast, drop, head, find, all, max, any,
  map, reduce, curry, forEach, min, take,
  split, when, test, match, pipe, equals,
  prop, filter, includes, not, unnest, identity, flatten, addIndex, is, identical,
} from 'ramda';

const isNested = pipe(find(Array.isArray), Boolean);
const isFlat = pipe(isNested, not);
const containsFlat = all(isFlat);
const indexedForEach = addIndex(forEach);
const indexedAll = addIndex(all);
const indexedFind = addIndex(find);
const findBy = curry((k, val) => find(pipe(prop(k), equals(val))));
const maxLength = reduce((acc, cur) => max(acc, cur.length), -Infinity);
const firstReal = find(Boolean);


export const cpts = [
  {
    key: 'thing',
    is: [
      ['*number', '*shape'],
      ['*number', '*color', '*shape'],
      ['*number', '*shape', '*place'],
      ['*number', '*color', '*shape', '*place'],
    ],
  },
  {
    key: 'shape',
    is: ['box', 'boxes', 'cone', 'cones', 'pyramid', 'pyramids', 'cylinder', 'cylinders', 'sphere', 'spheres'],
  },
  {
    key: 'place',
    is: [
      ['*direction'],
      ['to', '*direction'],
      ['to', 'the', '*direction'],
      ['on', '*direction', 'of'],
      ['on', 'the', '*direction', 'of'],
      ['*number', '*unit', '*direction'],
      ['*number', '*unit', 'to', '*direction'],
      ['*number', '*unit', 'to', 'the', '*direction'],
    ],
  },
  {
    key: 'unit',
    is: ['meter', 'meters'],
  },
  {
    key: 'number',
    is: ['1', '2', '3', 'a', 'an', 'one', 'two', 'three'],
  },
  {
    key: 'color',
    is: ['red', 'green', 'blue'],
  },
  {
    key: 'direction',
    is: ['top', 'bottom', 'left', 'right', 'front', 'back'],
  },
];


// new try
/* const cpts = [
  {
    key: 'shape',
    is: [
      'box', 'sphere',
    ],
  },
  {
    key: 'color',
    is: [
      'blue', 'red',
    ],
  },
  {
    key: 'direction',
    is: [
      'left', 'right',
    ],
  },
  {
    key: 'thing',
    is: [
      ['a', '*shape'],
      ['a', '*color', '*shape'],
      ['a', '*shape', '*place'],
      ['a', '*color', '*shape', '*place'],
      ['a', '*shape', '*place', 'now'],
      ['two', '*shape'],
    ],
  },
  {
    key: 'place',
    is: [
      ['to', 'the', '*direction'],
    ],
  },
]; */

// helpers
const findByKey = findBy('key');

// understandConcepts:: string -> {[keyOf simple]: string}
export const understandConcepts = (concepts, key, content) => {
  //
  const understood = {};

  // computer concept
  const concept = findByKey(key)(concepts);

  // user sentence as an array of words
  const words = split(' ', content);

  // match the first phrase that contains each concept well placed
  const findPath = (parts, understanding) => find((attempt) => pipe(reduce((acc, part) => {
    // this "find" is an "all" process. Stop it on first mismatch.
    if (!acc.continue) {
      return acc;
    }

    // if a subpattern was previously found, ignore parts until the words concerned are clear
    if (acc.ignore) {
      return {
        ...acc,
        ignore: acc.ignore - 1,
      };
    }

    // "attempt" represent a serie of concept like ["a", "*color", "*shape"]
    // get the new key, like "a", "*color", "*shape"
    const newKey = attempt[acc.idx];

    // new key doesn't exist, go next
    if (!newKey) {
      return {
        ...acc,
        idx: acc.idx + 1,
        continue: false,
      };
    }

    // new key doesn't begin with star: it's simple concept like "a"
    if ((head(newKey) !== '*')) {
      return {
        ...acc,
        idx: acc.idx + 1,
        continue: newKey === part,
      };
    }

    // new key begin with star: check if this new concept exists
    const val = drop(1, newKey);
    const newConcept = findByKey(val)(concepts);
    if (!newConcept) {
      return {
        ...acc,
        idx: acc.idx + 1,
        continue: false,
      };
    }

    // if new concept is an simple array of choice, check if part is in here
    if (isFlat(newConcept.is)) {
      if (includes(part, newConcept.is)) {
        understanding[newConcept.key] = part;
      }
      return {
        ...acc,
        idx: acc.idx + 1,
        continue: includes(part, newConcept.is),
      };
    }

    // recursion on nested concept
    understanding[newConcept.key] = {};

    const sub = pipe(map((nc) => {
      const newParts = take(nc.length, drop(acc.idx, parts));
      return findPath(newParts, understanding[newConcept.key])([nc]);
    }), firstReal)(newConcept.is);

    return {
      ...acc,
      continue: !!sub,
      idx: acc.idx + 1,
      ignore: sub ? sub.length - 1 : 0,
    };
  }, {
    continue: true,
    parts,
    idx: 0,
    ignore: 0,
  }), prop('continue'))(parts));

  const solution = findPath(words, understood)(concept.is);


  return { solution, understood };
};

console.log(understandConcepts(cpts, 'thing', 'a blue box'));
console.log(understandConcepts(cpts, 'thing', 'x blue box'));
console.log(understandConcepts(cpts, 'thing', 'two box'));
console.log(understandConcepts(cpts, 'thing', 'a sphere'));
console.log(understandConcepts(cpts, 'thing', 'a red sphere to the left'));
console.log(understandConcepts(cpts, 'thing', 'a sphere to the x'));
console.log(understandConcepts(cpts, 'thing', 'a box to the right now'));
console.log(understandConcepts(cpts, 'place', 'to the left'));
console.log(understandConcepts(cpts, 'thing', 'a red sphere 1 meter to the left'));
