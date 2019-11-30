export const afShapes = [
  {
    names: ['box', 'cube'],
    plurals: ['boxes', 'cubes'],
    tag: 'box',
    defaultAttrs: {
      width: 1,
      height: 1,
      depth: 1,
    },
  },
  {
    names: ['cone'],
    plurals: ['cones'],
    tag: 'cone',
    defaultAttrs: {
      height: 1,
      'radius-bottom': 0.5,
      'radius-top': 0,
    },
  },
  {
    names: ['pyramid'],
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
    names: ['cylinder'],
    plurals: ['cylinders'],
    tag: 'cylinder',
    defaultAttrs: {
      radius: 0.5,
      height: 1,
    },
  },
  {
    names: ['sphere', 'ball'],
    plurals: ['spheres', 'balls'],
    tag: 'sphere',
    defaultAttrs: {
      radius: 0.5,
    },
  },
];
