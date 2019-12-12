// npm
import {
  pluck, includes, last, take, head, drop, tail, pipe,
} from 'ramda';

// data
import { x11Colors } from '../domain/colors';
import { shapes, getShapeNames } from '../domain/shapes';
import { demonstrativePronouns } from '../domain/pronouns';

const colors = pluck('web', x11Colors);

const checkColoredThing = ([article, color, shape], scene) => (includes(article, demonstrativePronouns)
  && includes(color, colors)
  && includes(shape, shapes)
  ? scene.filter((el) => el.color === color && el.names.includes(shape))
  : null);

const checkThing = ([article, shape], scene) => (includes(article, demonstrativePronouns)
  && includes(shape, shapes)
  ? scene.filter((el) => getShapeNames(el).includes(shape))
  : null);

const checkIt = (article, scene) => (article === 'it' ? (last(scene) ? [last(scene)] : []) : null);

export const understandMove = (words, sceneEls) => {
  let things;
  let where;
  let error;

  // the blue box, that blue box
  const foundColoredThing = checkColoredThing(take(3, words), sceneEls);
  if (foundColoredThing) {
    return {
      things: foundColoredThing,
      where: drop(3, words),
      error: !foundColoredThing
        ? `I can't understand what is "<span>${take(3, words).join(' ')}</span>"`
        : foundColoredThing.length === 0
          ? `I can't find any ${pipe(tail, take(2))(words).join(' ')} here`
          : null,
    };
  }

  // the box, that box
  const foundThing = checkThing(take(2, words), sceneEls);
  if (foundThing) {
    return {
      things: foundThing,
      where: drop(2, words),
      error: !foundThing
        ? `I can't understand what is "<span>${take(2, words).join(' ')}</span>".`
        : foundThing.length === 0
          ? `I can't find any ${pipe(tail, take(1))(words)} here.`
          : null,
    };
  }

  // it
  const foundIt = checkIt(head(words), sceneEls);
  if (foundIt) {
    return {
      things: foundIt,
      where: tail(words),
      error: !foundIt
        ? `I can't understand what is "<span>${take(1, words).join(' ')}</span>".`
        : foundIt.length === 0
          ? 'There is nothing to move here.'
          : null,
    };
  }

  return {
    things,
    where,
    error,
  };
};
