import React, { useState } from 'react';
import './App.css';
import 'aframe';

function App() {
  const [scene, setScene] = useState({
    items: [],
    lastPos: [0, 0, -5],
  });
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
            position: scene.lastPos.join(' '),
            rotation: '0 45 0',
          };
          setScene(({ items, lastPos: [x, y, z] }) => ({
            items: [...items, newItem],
            lastPos: [x, y + 1, z],
          }));
          break;
        }
        default:
          break;
      }
      event.target.value = '';
    }
  };

  return (
    <div className="App">
      <div className="main-container">
        <div className="w-50">
          <label htmlFor="command">Write anything like &quot;create a blue box&quot;. Then press [Enter].</label>
          <br />
          <input id="command" onKeyPress={handleKeyPress} />
          {/*  <Terminal
            color="green"
            textTransform="uppercase"
            backgroundColor="black"
            barColor="black"
            style={{ fontWeight: 'bold', fontSize: '1em' }}
            commands={{
              create: {
                method({ _: [article, color, shape] }, print) {
                  console.log('scene', scene);
                  const colors = ['blue', 'green', 'red', 'yellow'];
                  const shapes = ['box', 'cone', 'cylinder'];
                  if (!colors.includes(color)) {
                    return print(
                      `Unknown color. Choose between ${colors.join(', ')}.`,
                    );
                  }
                  if (!shapes.includes(shape)) {
                    return print(
                      `Unknown shape. Choose between ${shapes.join(', ')}.`,
                    );
                  }
                  const newItem = {
                    Shape: `a-${shape}`,
                    color,
                    position: scene.lastPos.join(' '),
                    rotation: '0 45 0',
                  };
                  setScene(({ items, lastPos: [x, y, z] }) => ({
                    items: [...items, newItem],
                    lastPos: [x, y + 1, z],
                  }));
                  return print('Done.');
                },
              },
            }}
            descriptions={{
              create: 'To create anything.',
            }}
            msg='Ask SHRDLU anything, like "create a blue box".'
          /> */}
        </div>
        <div className="w-50">
          <a-scene embedded>
            {/*         <a-assets>
              <img src="sone.png" id="sone"></img>
            </a-assets>
            <a-box rotation="0 45 0" position="0 0 -5" src="#sone"></a-box> */}
            {scene.items.map(({
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
