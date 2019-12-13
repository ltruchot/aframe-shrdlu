import { pluck } from 'ramda';
import { x11Colors } from '../../domain/colors';


export const concepts = [
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
    is: pluck('web', x11Colors),
  },
  {
    key: 'direction',
    is: ['top', 'bottom', 'left', 'right', 'front', 'back'],
  },
];
