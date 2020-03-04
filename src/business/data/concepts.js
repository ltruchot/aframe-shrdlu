import {
  pluck, range, map, toString, keys, concat, pipe,
} from 'ramda';
import { x11Colors } from '../../domain/colors';
import { textNumbers } from '../../domain/numbers';

const integers = map(toString, range(1, 100));
const numbers = pipe(keys, concat(integers))(textNumbers);
console.log(numbers);


export const concepts = [
  {
    key: 'command',
    is: [],
    contains: [['*verb', '*thing']]
  },
  {
    key: 'verb',
    is: ['create'],
    contains: [],
  },
  {
    key: 'thing',
    is: [],
    contains: [
      ['*number', '*shape'],
      ['*number', '*color', '*shape'],
      ['*number', '*shape', '*place'],
      ['*number', '*color', '*shape', '*place'],
    ],
  },
  {
    key: 'shape',
    is: ['box', 'boxes', 'cone', 'cones', 'pyramid', 'pyramids', 'cylinder', 'cylinders', 'sphere', 'spheres'],
    contains: []
  },
  {
    key: 'place',
    is: [],
    contains: [
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
    contains: []
  },
  {
    key: 'number',
    is: numbers,
    contains: []
  },
  {
    key: 'color',
    is: pluck('web', x11Colors),
    contains: []
  },
  {
    key: 'direction',
    is: ['top', 'bottom', 'left', 'right', 'front', 'back'],
    contains: []
  },
];
