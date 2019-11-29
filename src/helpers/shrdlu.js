// npm
import {
  pluck, prop, reduce, concat, includes, last, take, head,
} from 'ramda';

// data
import { x11Colors } from '../data/colors';
import { afShapes } from '../data/shapes';
import { demonstrativePronouns } from '../data/pronouns';

const colors = pluck('web', x11Colors);
const shapes = reduce((acc, cur) => concat(prop('names', cur), acc), [], afShapes);

const checkColoredThing = ([article, color, shape], scene) => (includes(article, demonstrativePronouns)
  && includes(color, colors)
  && includes(shape, shapes)
  ? scene.filter((el) => el.color === color && el.names.includes(shape))
  : null);

const checkThing = ([article, shape], scene) => (includes(article, demonstrativePronouns)
  && includes(shape, shapes)
  ? scene.filter((el) => el.names.includes(shape))
  : null);

const checkIt = (article, scene) => (article === 'it' ? [last(scene)] : null);

export const understandMove = (words, sceneEls) => {
  let things;
  let where;

  // the blue box, that blue box
  const foundColoredThing = checkColoredThing(take(3, words), sceneEls);
  if (foundColoredThing) {
    return { things: foundColoredThing };
  }

  // the box, that box
  const foundThing = checkThing(take(2, words), sceneEls);
  if (foundThing) {
    return { things: foundThing };
  }

  // it
  const foundIt = checkIt(head(words), sceneEls);
  if (foundIt) {
    return { things: foundIt };
  }

  return {
    things,
    where,
  };
};
