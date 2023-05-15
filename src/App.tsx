import { Sprite, Stage } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import './App.css';
import Hud from './components/Hud';
import System from './components/System';
import AndGate from './gates/AndGate';
import NotGate from './gates/NotGate';
import * as Logic from './logic';


export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [system, setSystem] = useState(new Logic.System(2));

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);

  return (
    <>
      <Hud />
      <Stage width={width} height={height} options={{ backgroundColor: 0x222222 }}>
        <System system={system} windowSize={[width, height]}>
          <NotGate x={500} y={400} />
          <AndGate x={500} y={250} />
        </System>
        {/* This sprite makes the interaction with the Graphics work. See https://github.com/pixijs/pixi-react/issues/402 */}
        <Sprite texture={Texture.WHITE} height={0} width={0} />
      </Stage>
    </>
  );
}
