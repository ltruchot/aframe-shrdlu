// npm
import React, { useState, useEffect } from 'react';
import { sanitize } from 'dompurify';

import './business/aframe.directives';

// styles
import './App.css';

// helpers
import { createAframeElements } from './business/aframe.helpers';

// data
import { textNumbers } from './domain/numbers';
import { introduction } from './business/data/terminal';
import { understandCommand } from './business/shrdlu/understand';
import { findShapeByName } from './domain/shapes';


function App() {
  // states
  const [autoid, setAutoid] = useState(0);
  const [scene, setScene] = useState([]);
  const [lastPos, setLastPos] = useState([0, 0, -5]);
  const [terminalLines, setTerminalLines] = useState(introduction);

  const terminalRef = React.createRef();

  // effects
  useEffect(() => {
    if (terminalRef && terminalRef.current) {
      terminalRef.current.scrollTo(0, terminalRef.current.scrollHeight);
    }
  }, [terminalLines, terminalRef]);

  const printCommand = (command, response) => {
    setTerminalLines((oldCommands) => [
      ...oldCommands,
      { text: command, type: 'human' },
      { text: response, type: 'shrdlu' },
    ]);
  };

  const displayError = (command, err) => {
    const errors = [
      'What did you said ?',
      `Sorry but I didn't understand what is "<span>${err.original}</span>".`,
      `I can't do this "<span>${err.original}</span>" action`,
    ];
    printCommand(command, errors[err.code] || "An error that I can't expain just happened");
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // vars
      //

      // input
      const iptEl = event.target;
      const command = sanitize(iptEl.value, { ALLOWED_TAGS: [] }); // sanitize
      if (!command) {
        return displayError('', { code: 0, msg: 'empty', original: '' });
      }

      // const getErrorWithList = (val, type, list) => `Unknown "<span>${val}</span>" ${type}. Choose between <span>${list.join(', ')}</span>.`;

      // choose command and output
      /*
      switch (command) {
        case 'draw':
        case 'create': {
          // input
          const [number, color, shape] = args;

          // check and format number
          if (!textNumbers[number] && Number.isNaN(+number)) {
            printCommand(iptValue, getErrorWithList(number, 'number', uniq(Object.values(textNumbers))));
            iptEl.value = '';
            return;
          }
          const n = Number.isNaN(+number) ? textNumbers[number] : +number;

          // check color
          if (!includes(color, colors)) {
            printCommand(iptValue, getErrorWithList(color, 'color', colors));
            iptEl.value = '';
            return;
          }

          // check shape
          if (!includes(shape, shapes)) {
            printCommand(iptValue, getErrorWithList(shape, 'shape', map(pipe(prop('names'), head), afShapes)));
            iptEl.value = '';
            return;
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
          const { things, where, error } = understandMove(args, scene);
          if (error) {
            printCommand(iptValue, error);
            iptEl.value = '';
            return;
          }
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
 */
      console.log(understandCommand(command));
      const [err, {
        understood: {
          number, color, shape,
        },
      }] = understandCommand(command);

      if (err) {
        return displayError(command, err);
      }

      const afShape = findShapeByName(shape);
      const fNumber = textNumbers[number] || parseInt(number, 10);

      const newItems = createAframeElements(fNumber, color, afShape, lastPos, autoid);
      setAutoid((id) => id + newItems.length);
      setScene((items) => [...items, ...newItems]);
      setLastPos(([x, y, z]) => [x, y + newItems.length, z]);
      printCommand(command, 'Done.');
      iptEl.value = '';
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
          <a-entity camera wasd-controls acceleration="100" look-controls position="-5 1 0" rotation="0 -45 0">
            <a-camera id="camera" />
          </a-entity>
        </a-scene>
      </div>
    </div>
  );
}

export default App;
