import { Sprite, Stage } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import DottedGrid from './components/DottedGrid';
import EventsController from './components/EventsController';
import Hud from './components/Hud';
import System from './components/System';
import { store } from './redux/store';

import './App.css';


export default function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);


  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  }, []);


  const onMouseDownRef = useRef(null as any);
  const onMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    onMouseDownRef.current(event);
  }, []);

  const onMouseUpRef = useRef(null as any);
  const onMouseUp = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    onMouseUpRef.current(event);
  }, []);

  const onMouseMoveRef = useRef(null as any);
  const onMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    onMouseMoveRef.current(event);
  }, []);


  return (
    <>
      <Stage
        width={width}
        height={height}
        options={{ backgroundColor: 0x222222, antialias: true }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}>
        <Provider store={store}>

          {/* This component is responsible for rendering the grid */}
          <DottedGrid />

          {/* This component is responsible for handling the events */}
          <EventsController
            onMouseDownRef={onMouseDownRef}
            onMouseUpRef={onMouseUpRef}
            onMouseMoveRef={onMouseMoveRef} />

          {/* System that contains all the chips and rendering the components inside it */}
          <System />

          {/* This sprite makes the interaction with the Graphics work. See https://github.com/pixijs/pixi-react/issues/402 */}
          <Sprite texture={Texture.WHITE} height={0} width={0} />

          <Hud />
        </Provider>
      </Stage>
    </>
  );
}
