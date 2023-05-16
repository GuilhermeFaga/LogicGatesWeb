import { Sprite, Stage } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Connection from './components/Connection';
import Hud from './components/Hud';
import System from './components/System';
import { store } from './redux/store';


export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);

  return (
    <>
      <Hud />
      <Stage width={width} height={height} options={{ backgroundColor: 0x222222, antialias: true }}>
        <Provider store={store}>
          <System windowSize={[width, height]} />
          {/* This sprite makes the interaction with the Graphics work. See https://github.com/pixijs/pixi-react/issues/402 */}
          <Sprite texture={Texture.WHITE} height={0} width={0} />
          <Connection start={{ x: 50, y: 50 }} end={{ x: 250, y: 100 }} />
        </Provider>
      </Stage>
    </>
  );
}
