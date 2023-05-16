import { Graphics } from '@pixi/react';
import { FederatedEventHandler, FederatedPointerEvent, Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback, useState } from 'react';
import { constants } from '../constants';


interface Props {
  x: number;
  y: number;
  value: number,
  onmousedown?: FederatedEventHandler<FederatedPointerEvent>;
  onmouseup?: FederatedEventHandler<FederatedPointerEvent>;
}

const borderWidth = constants.components.pin.borderWidth;
const width = constants.components.pin.width;
const radius = width / 2;

export default function Pin(props: Props) {
  const { x, y, value, onmousedown, onmouseup } = props;

  const [isMouseOver, setIsMouseOver] = useState(false);

  const baseColor = value ? constants.colors.on : constants.colors.off;
  const mouseOverColor = value ? constants.colors.mouseOver.on : constants.colors.mouseOver.off;
  const fillColor = isMouseOver ? mouseOverColor : baseColor;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      g.clear();
      g.beginFill(constants.colors.border);
      g.drawCircle(x, y, radius);
      g.beginFill(fillColor);
      g.drawCircle(x, y, radius - borderWidth);
      g.endFill();
    },
    [x, y, fillColor],
  );

  return <Graphics draw={draw} eventMode='dynamic'
    onmouseenter={() => setIsMouseOver(true)}
    onmouseleave={() => setIsMouseOver(false)}
    onmousedown={onmousedown || (() => { })}
    onmouseup={onmouseup || (() => { })} />;
}