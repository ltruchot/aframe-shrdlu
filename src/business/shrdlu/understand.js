// npm
import {
  pipe, // func
  split, includes, find, head, reduce, tail, drop, map, take, // array
  replace, trim, // string
  prop, // object
} from 'ramda';
import { actions } from '../data/actions';
import { concepts } from '../data/concepts';
import {
  compact, findBy, isFlat, firstReal,
} from '../../core/array';

// helpers
const findByKey = findBy('key');
const extractWords = pipe(trim, replace(/\s\s+/g, ' '), split(' '), compact);


// understandConcepts:: string -> {[keyOf simple]: string}
export const understandConcepts = (key, words) => {
  const understood = {};

  // computer concept
  const concept = findByKey(key)(concepts);


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

const understandContent = (action, content) => {
  let error = null;
  const { solution, understood } = understandConcepts(action.tail, content);
  if (typeof solution === 'undefined') {
    error = { msg: 'misunderstood', code: 1, original: content.join(' ') };
  }
  return [error, { actionName: action.name, solution, understood }];
};


// understandCommand str -> [error, action]
export const understandCommand = (command) => {
  const words = extractWords(command);

  // empty case
  if (!words.length) {
    return [{ msg: 'empty', code: 0 }, { understood: {} }];
  }

  // action
  const verb = head(words);
  const action = find((item) => includes(verb, item.aliases), actions);
  if (!action) {
    return [{ msg: 'unknown action', code: 2, original: verb }, { understood: {} }];
  }

  // "me" in actions
  let content = tail(words);
  if (head(content) === 'me') {
    content = tail(content);
  }

  // content
  return understandContent(action, content);
};


/* console.log(understandConcepts(cpts, 'thing', 'a blue box'));
console.log(understandConcepts(cpts, 'thing', 'x blue box'));
console.log(understandConcepts(cpts, 'thing', 'two box'));
console.log(understandConcepts(cpts, 'thing', 'a sphere'));
console.log(understandConcepts(cpts, 'thing', 'a red sphere to the left'));
console.log(understandConcepts(cpts, 'thing', 'a sphere to the x'));
console.log(understandConcepts(cpts, 'thing', 'a box to the right now'));
console.log(understandConcepts(cpts, 'place', 'to the left'));
console.log(understandConcepts(cpts, 'thing', 'a red sphere 1 meter to the left')); */
