import React, { useState } from 'react';
import './App.css';
import 'aframe';

function App() {
  const [scene, setScene] = useState([]);
  const [lastPos, setLastPos] = useState([0, 0, -5]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const [command, article, color, shape] = event.target.value.split(' ');
      const colors = ['blue', 'green', 'red', 'yellow'];
      const shapes = ['box', 'cone', 'cylinder'];
      if (!colors.includes(color)) {
        console.log(`Unknown color. Choose between ${colors.join(', ')}.`);
      }
      if (!shapes.includes(shape)) {
        console.log(`Unknown shape. Choose between ${shapes.join(', ')}.`);
      }
      switch (command) {
        case 'create': {
          const newItem = {
            Shape: `a-${shape}`,
            color,
            width: 1,
            height: 1,
            depth: 1,
            position: lastPos.join(' '),
            rotation: '0 45 0',
          };
          setScene((items) => [...items, newItem]);
          setLastPos(([x, y, z]) => [x, y + 1, z]);
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
        </div>
        <div className="w-50">
          <a-scene embedded>
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
            <a-plane position="0 -0.5 -4" rotation="-90 45 0" width="4" height="4" color="#7BC8A4" />
            <a-sky color="#ECECEC" />
          </a-scene>
        </div>
      </div>
    </div>
  );
}

export default App;
