// npm
import React, { useState } from 'react';
import 'aframe';
import {
  pluck, range, map, pipe, prop, reduce, concat, find, includes, head,
} from 'ramda';

// styles
import './App.css';

// data
import { x11Colors } from './data/colors';
import { textNumbers } from './data/numbers';
import { afShapes } from './data/shapes';

function App() {
  const [scene, setScene] = useState([]);
  const [lastPos, setLastPos] = useState([0, 0, -5]);

  const createAframeElements = (number, color, afShape) => {
    const newItems = range(0, number)
      .map((el, i) => {
        const [x, y, z] = lastPos;
        return {
          Shape: `a-${afShape.tag}`,
          ...afShape.defaultAttrs,
          color,
          position: [x, y + i, z].join(' '),
        };
      });
    setScene((items) => [...items, ...newItems]);
    setLastPos(([x, y, z]) => [x, y + newItems.length, z]);
  };
  const findShapeByName = (name) => find((el) => includes(name, prop('names', el)), afShapes);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // input
      const [command, number, color, shape] = event.target.value.split(' ');

      // check and format number
      if (!textNumbers[number] && Number.isNaN(+number)) {
        return console.log(`Unknown number. Choose between ${Object.values(textNumbers).join(', ')}.`);
      }
      const n = Number.isNaN(+number) ? textNumbers[number] : +number;

      // check colors
      const webColors = pluck('web', x11Colors);
      if (!includes(color, webColors)) {
        return console.log(`Unknown color. Choose between ${webColors.join(', ')}.`);
      }

      // check shapes
      const shapes = reduce((acc, cur) => concat(prop('names', cur), acc), [], afShapes);
      if (!includes(shape, shapes)) {
        return console.log(`Unknown shape. Choose between ${map(pipe(prop('names'), head), afShapes).join(', ')}.`);
      }
      const afShape = findShapeByName(shape);
      console.log(afShape);
      // choose command and output
      switch (command) {
        case 'create': {
          createAframeElements(n, color, afShape);
          event.target.value = '';
          break;
        }
        default:
          break;
      }
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="w-50">
          <label htmlFor="command">Write anything like &quot;create a blue box&quot;. Then press [Enter].</label>
          <br />
          <input id="command" onKeyPress={handleKeyPress} />
          <button onClick={() => createAframeElements(1, 'blue', findShapeByName('box'))}>blue box</button>
          <button onClick={() => createAframeElements(1, 'yellow', findShapeByName('pyramid'))}>yellow pyramid</button>
        </div>
        <div className="w-50">
          <a-scene
            embedded
          >
            {/*
            <a-assets>
              <img src="sone.png" id="sone"></img>
            </a-assets>
            <a-box rotation="0 45 0" position="0 0 -5" src="#sone"></a-box>
            */}
            {scene.map(({
              Shape, ...attrs
            }, i) => (
              <Shape
                {...attrs}
                key={i}
              />
            ))}
            <a-plane position="0 -0.5 -5" rotation="-90 0 0" width="7" height="7" color="#7BC8A4" />
            <a-sky color="#ECECEC" />
            <a-entity camera wasd-controls acceleration="100" look-controls position="0 1 0">
              <a-camera id="camera" />
            </a-entity>
          </a-scene>
        </div>
      </div>
    </div>
  );
}

export default App;
