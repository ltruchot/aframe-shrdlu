// npm
import React, { useState, useEffect } from 'react';
import {
  pluck, map, pipe, prop, reduce, concat, find, includes, head, inc, uniq,
} from 'ramda';
import { sanitize } from 'dompurify';

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
  // states
  const [autoid, setAutoid] = useState(0);
  const [scene, setScene] = useState([]);
  const [lastPos, setLastPos] = useState([0, 0, -5]);
  const [terminalLines, setTerminalLines] = useState([
    { text: 'Hi human.', type: 'shrdlu' },
    { text: 'Write anything like "<span>create a blue box</span>". Then press [Enter].', type: 'shrdlu' },
  ]);

  const terminalRef = React.createRef();

  // effects
  useEffect(() => {
    if (terminalRef && terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight);
    }
  }, [terminalLines]);

  const printCommand = (command, response) => {
    setTerminalLines((oldCommands) => [
      ...oldCommands,
      { text: command, type: 'human' },
      { text: response, type: 'shrdlu' },
    ]);
  };
  const findShapeByName = (name) => find((el) => includes(name, prop('names', el)), afShapes);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // vars
      const colors = pluck('web', x11Colors);
      const shapes = reduce((acc, cur) => concat(prop('names', cur), acc), [], afShapes);

      // input
      const iptEl = event.target;
      const iptValue = sanitize(iptEl.value, { ALLOWED_TAGS: [] }); // sanitize
      const [command, ...args] = iptValue.split(' ');

      // choose command and output
      switch (command) {
        case 'draw':
        case 'create': {
          // input
          const [number, color, shape] = args;

          // check and format number
          if (!textNumbers[number] && Number.isNaN(+number)) {
            return printCommand(iptValue, `Unknown number. Choose between <span>${uniq(Object.values(textNumbers)).join(', ')}</span>.`);
          }
          const n = Number.isNaN(+number) ? textNumbers[number] : +number;

          // check color
          if (!includes(color, colors)) {
            return printCommand(iptValue, `Unknown "<span>${color}</span>" color. Choose between <span>${colors.join(', ')}.</span>`);
          }

          // check shape
          if (!includes(shape, shapes)) {
            return printCommand(iptValue, `Unknown shape. Choose between <span>${map(pipe(prop('names'), head), afShapes).join(', ')}.</span>`);
          }
          const afShape = findShapeByName(shape);

          const newItems = createAframeElements(n, color, afShape, lastPos, autoid);
          setAutoid((id) => id + newItems.length);
          setScene((items) => [...items, ...newItems]);
          setLastPos(([x, y, z]) => [x, y + newItems.length, z]);
          printCommand(iptValue, 'Done.');
          iptEl.value = '';
          break;
        }
        case 'move': {
          const { things, where } = understandMove(args, scene);
          console.log(things, where);
          setScene((elements) => elements.map((el) => (things.includes(el) ? { ...el, position: [...alterByIndex(inc, 2, el.position)] } : el)));
          printCommand(iptValue, 'Done.');
          iptEl.value = '';
          break;
        }
        default:
          printCommand(iptValue, `I don't understand the word "<span>${command}</span>" in this context`);
          iptEl.value = '';
          break;
      }
    }
  };

  const focusInput = (e) => {
    const ipt = e && e.target && e.target.querySelector('input');
    if (ipt && ipt.focus) {
      e.target.querySelector('input').focus();
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="terminal" onClick={focusInput} ref={terminalRef}>
          {terminalLines.map((line, i) => (
            <p
              className={line.type}
              key={i}
              dangerouslySetInnerHTML={{ __html: line.text }}
            />
          ))}
          <input id="command" onKeyPress={handleKeyPress} autoFocus />
        </div>

        <a-scene embedded>
          {scene.map(({
            Shape, names, tag, id, position, ...attrs
          }) => <Shape position={position.join(' ')} {...attrs} key={id} />)}
          <a-plane position="0 -0.5 -5" rotation="-90 0 0" width="7" height="7" color="#7BC8A4" />
          <a-sky color="#ECECEC" />
          <a-entity camera wasd-controls acceleration="100" look-controls position="-5 2 -1" rotation="-25 -50 0">
            <a-camera id="camera" />
          </a-entity>
        </a-scene>
      </div>
    </div>
  );
}

export default App;
