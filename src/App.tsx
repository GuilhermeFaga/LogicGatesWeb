import { Sprite, Stage } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import DottedGrid from './components/DottedGrid';
import Hud from './components/Hud';
import System from './components/System';
import { setSelectedPin } from './redux/appReducer';
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
      <Stage width={width} height={height} options={{ backgroundColor: 0x222222, antialias: true }} onMouseUp={() => {
        store.dispatch(setSelectedPin(null));
      }}>
        <Provider store={store}>
          <DottedGrid />
          <System />

          {/* This sprite makes the interaction with the Graphics work. See https://github.com/pixijs/pixi-react/issues/402 */}
          <Sprite texture={Texture.WHITE} height={0} width={0} />

          <Hud />
        </Provider>
      </Stage>
    </>
  );
}
