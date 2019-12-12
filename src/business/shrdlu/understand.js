// npm
import {
  pipe, identity, // func
  split, filter, map, flatten, take, includes, find, head, // array
  replace, trim, tail, // string
} from 'ramda';
import { actions } from './actions.data';
import { uderstandConcepts } from './concepts';

const compact = filter(identity);
const extractWords = pipe(trim, replace(/\s\s+/g, ' '), split(' '), compact);


const understandContent = (action, content) => 
  // const concept = uderstandConcepts(content, action);
   [null, { actionName: action.name }]
;

// understandCommand str -> [error, action]
export const understandCommand = (command) => {
  const words = extractWords(command);

  // empty case
  if (!words.length) {
    return [{ msg: 'Empty command', code: 0 }];
  }

  // action
  const verb = head(words);
  const action = find((item) => includes(verb, item.aliases), actions);
  if (!action) {
    return [{ msg: 'Action unknown', code: 1 }, verb];
  }

  // "me" in actions
  let content = tail(words);
  if (head(content) === 'me') {
    content = tail(content);
  }

  // content
  return understandContent(action, content);
};
