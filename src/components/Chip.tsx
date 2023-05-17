import { Container, useApp, useTick } from '@pixi/react';
import { config } from '../config';
import * as Logic from '../logic';
import Board from './Board';
import InputPin from './InputPin';
import OutputPin from './OutputPin';
import { useState } from 'react';


interface Props {
  chip: Logic.Chip;
  x?: number;
  y?: number;
  color?: string;
}

const width = 150;

export default function Chip(props: Props) {
  const { chip, color } = props;
  var { x: _x, y: _y } = props;

  if (!_x || !_y) {
    _x = 0;
    _y = 0;
  }

  chip.update();

  const [x, setX] = useState(_x);
  const [y, setY] = useState(_y);

  const [dragging, setDragging] = useState(false);

  const [cursorXOffset, setCursorXOffset] = useState(0);
  const [cursorYOffset, setCursorYOffset] = useState(0);

  const app = useApp();
  useTick((delta) => {
    if (dragging) {
      setX(app.renderer.events.pointer.global.x - cursorXOffset);
      setY(app.renderer.events.pointer.global.y - cursorYOffset);
    }
  });

  const padding = config.components.gate.padding;
  const pinOffset = config.components.gate.pinOffset;
  const pinWidth = config.components.gate.pinWidth;
  const pinGap = config.components.gate.pinGap;

  const height = padding * 2 + (chip.inputs.length * pinWidth) + ((chip.inputs.length - 1) * pinGap);

  const inputs = chip.inputs.map((input, i) => {
    return <InputPin key={i} inputPin={input} x={pinWidth / 2} y={padding + pinOffset + ((pinWidth + pinGap) * i)} />;
  });

  const output = <OutputPin x={width} y={height / 2 + 8} outputPin={chip.output} />;

  return (
    <Container position={[x, y]} eventMode='dynamic'>
      <Board height={height} width={width} color={color}
        onmousedown={(event) => {
          setCursorXOffset(event.global.x - x);
          setCursorYOffset(event.global.y - y);
          setDragging(true);
        }}
        onmouseup={(event) => {
          setDragging(false);
        }} />
      {inputs}
      {output}
    </Container>
  );
}
