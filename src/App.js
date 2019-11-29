// npm
import React, { useState } from 'react';
import {
  pluck, map, pipe, prop, reduce, concat, find, includes, head, inc,
} from 'ramda';

import './aframe-extension';

// styles
import './App.css';

// helpers

import { createAframeElements } from './helpers/aframe';
// data
import { x11Colors } from './data/colors';
import { textNumbers } from './data/numbers';
import { afShapes } from './data/shapes';
import { understandMove } from './helpers/shrdlu';
import { alterByIndex } from './helpers/ramda';


function App() {
  const [autoid, setAutoid] = useState(0);
  const [scene, setScene] = useState([]);
  const [lastPos, setLastPos] = useState([0, 0, -5]);

  const findShapeByName = (name) => find((el) => includes(name, prop('names', el)), afShapes);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // vars
      const colors = pluck('web', x11Colors);
      const shapes = reduce((acc, cur) => concat(prop('names', cur), acc), [], afShapes);
      // input
      const [command, ...args] = event.target.value.split(' ');
      // choose command and output
      switch (command) {
        case 'draw':
        case 'create': {
          // input
          const [number, color, shape] = args;

          // check and format number
          if (!textNumbers[number] && Number.isNaN(+number)) {
            return console.log(`Unknown number. Choose between ${Object.values(textNumbers).join(', ')}.`);
          }
          const n = Number.isNaN(+number) ? textNumbers[number] : +number;

          // check color
          if (!includes(color, colors)) {
            return console.log(`Unknown color. Choose between ${colors.join(', ')}.`);
          }

          // check shape
          if (!includes(shape, shapes)) {
            return console.log(`Unknown shape. Choose between ${map(pipe(prop('names'), head), afShapes).join(', ')}.`);
          }
          const afShape = findShapeByName(shape);

          const newItems = createAframeElements(n, color, afShape, lastPos, autoid);
          setAutoid((id) => id + newItems.length);
          setScene((items) => [...items, ...newItems]);
          setLastPos(([x, y, z]) => [x, y + newItems.length, z]);
          event.target.value = '';
          break;
        }
        case 'move': {
          const { things, where } = understandMove(args, scene);
          console.log(things, where);
          setScene((elements) => elements.map((el) => (things.includes(el) ? { ...el, position: [...alterByIndex(inc, 2, el.position)] } : el)));
          event.target.value = '';
          break;
        }
        default:
          console.log('Unknown command:', command);
          break;
      }
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="w-50 terminal">
          <label htmlFor="command">Write anything like &quot;create a blue box&quot;. Then press [Enter].</label>
          <input id="command" onKeyPress={handleKeyPress} autoFocus />
        </div>
        <div className="w-50">
          <a-scene embedded>
            {scene.map(({
              Shape, names, tag, id, position, ...attrs
            }) => <Shape position={position.join(' ')} {...attrs} key={id} />)}
            <a-plane position="0 -0.5 -5" rotation="-90 0 0" width="7" height="7" color="#7BC8A4" />
            <a-sky color="#ECECEC" />
            <a-entity camera wasd-controls acceleration="100" look-controls position="-5 1 -1" rotation="-25 -50 0">
              <a-camera id="camera" />
            </a-entity>
          </a-scene>
        </div>
      </div>
    </div>
  );
}

export default App;
