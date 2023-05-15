import { Stage } from '@pixi/react';
import React from 'react';
import './App.css';
import Hud from './components/Hud';
import AndGate from './gates/AndGate';
import NotGate from './gates/NotGate';



function App() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);

  window.addEventListener('resize', () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });

  return (
    <>
      <Hud />
      <Stage width={width} height={height} options={{ backgroundColor: 0x222222 }}>
        <NotGate x={500} y={400} />
        <AndGate x={500} y={250} />
      </Stage>
    </>
  );
}


export default App;
