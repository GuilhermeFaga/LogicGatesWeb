import { Graphics } from '@pixi/react';
import { Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback } from 'react';
import { constants } from '../constants';


interface Props {
  x: number;
  y: number;
  value: number,
}

const borderWidth = constants.components.pin.borderWidth;
const width = constants.components.pin.width;
const radius = width / 2;

export default function Pin(props: Props) {

  const { x, y, value } = props;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      g.clear();
      g.beginFill(constants.colors.border);
      g.drawCircle(x, y, radius);
      g.beginFill(value ? constants.colors.on : constants.colors.off);
      g.drawCircle(x, y, radius - borderWidth);
      g.endFill();
    },
    [x, y, value],
  );

  return <Graphics draw={draw} />;
}