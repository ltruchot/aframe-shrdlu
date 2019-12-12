import {
  map, pipe, flatten, props, find, includes,
} from 'ramda';

export const afShapes = [
  {
    singulars: ['box', 'cube'],
    plurals: ['boxes', 'cubes'],
    tag: 'box',
    defaultAttrs: {
      width: 1,
      height: 1,
      depth: 1,
    },
  },
  {
    singulars: ['cone'],
    plurals: ['cones'],
    tag: 'cone',
    defaultAttrs: {
      height: 1,
      'radius-bottom': 0.5,
      'radius-top': 0,
    },
  },
  {
    singulars: ['pyramid'],
    plurals: ['pyramids'],
    tag: 'cone',
    defaultAttrs: {
      height: 1,
      'radius-bottom': 0.7071, // cos(45°)
      'radius-top': 0,
      'segments-radial': 4,
      rotation: '0 45 0',
    },
  },
  {
    singulars: ['cylinder'],
    plurals: ['cylinders'],
    tag: 'cylinder',
    defaultAttrs: {
      radius: 0.5,
      height: 1,
    },
  },
  {
    singulars: ['sphere', 'ball'],
    plurals: ['spheres', 'balls'],
    tag: 'sphere',
    defaultAttrs: {
      radius: 0.5,
    },
  },
];


export const getShapeNames = pipe(props(['singulars', 'plurals']), flatten);
export const findShapeByName = (name) => find((el) => includes(name, getShapeNames(el)), afShapes);

export const shapes = pipe(
  map(getShapeNames),
  flatten,
)(afShapes);
