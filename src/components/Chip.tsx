import { Container, useApp, useTick } from '@pixi/react';
import { Container as PIXIContainer } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { config } from 'src/config';
import * as Logic from 'src/logic';
import { useAppSelector } from 'src/redux/hooks';
import Board from './Board';
import InputPin from './InputPin';
import OutputPin from './OutputPin';


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

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [cursorXOffset, setCursorXOffset] = useState(0);
  const [cursorYOffset, setCursorYOffset] = useState(0);

  const selected = useAppSelector(state => state.app.selectedChips.includes(chip));

  const app = useApp();
  useTick((delta) => {
    if (isDragging) {
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
    <Container position={[x, y]} name={chip.id}>
      <Board height={height} width={width} color={color} selected={selected}
        onmousedown={(event) => {
          setCursorXOffset(event.global.x - x);
          setCursorYOffset(event.global.y - y);
          setIsMouseDown(true);
        }}

        onmouseup={(event) => {
          setIsMouseDown(false);
          setIsDragging(false);
        }}

        onmousemove={(event) => {
          if (isMouseDown) {
            setIsDragging(true);
          }
        }}
      />
      {inputs}
      {output}
    </Container>
  );
}
