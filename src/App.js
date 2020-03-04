// npm
import React, { useState, useEffect } from 'react';

import './business/aframe.directives';


// helpers
import { process } from 'scoped-natural-language-processor';
import { pipe, find, prop } from 'ramda';
import { createAframeElements } from './business/aframe.helpers';

// data
import { textNumbers } from './domain/numbers';
import { introduction } from './business/data/terminal';
import { findShapeByName } from './domain/shapes';
import { concepts } from './business/data/concepts';


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
      `Sorry but I didn't understand what is "<span>${err.input}</span>".`,
      `I can't do this "<span>${err.input}</span>" action`,
    ];
    printCommand(command, errors[err.code] || "An error that I can't explain just happened");
  };


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // input
      const iptEl = event.target;
      const command = iptEl.value;
      const [err, res] = process(concepts, command);
      if (err) {
        console.error(err);
        return displayError('', err.errors[0]);
      }
      const [verb, thing] = res.understood;
      console.log(verb, thing);
      switch (verb.value) {
        case 'create': {
          const extractValue = (c) => pipe(
            find((val) => val.concept === c),
            prop('value'),
          );
          const shape = extractValue('shape')(thing.value);
          const number = extractValue('number')(thing.value);
          const color = extractValue('color')(thing.value);
          const afShape = findShapeByName(shape);
          const fNumber = textNumbers[number] || parseInt(number, 10);

          const newItems = createAframeElements(fNumber, color, afShape, lastPos, autoid);
          setAutoid((id) => id + newItems.length);
          setScene((items) => [...items, ...newItems]);
          setLastPos(([x, y, z]) => [x, y + newItems.length, z]);
          printCommand(command, 'Done.');
          iptEl.value = '';
          break;
        }
        default:
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
          <a-entity camera wasd-controls acceleration="100" look-controls position="-5 1 0" rotation="0 -45 0">
            <a-camera id="camera" />
          </a-entity>
        </a-scene>
      </div>
    </div>
  );
}

export default App;
