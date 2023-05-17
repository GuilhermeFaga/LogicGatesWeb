import { Graphics } from '@pixi/react';
import { FederatedEventHandler, FederatedPointerEvent, Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';
import { config } from '../config';
import * as Logic from '../logic';
import { updateConnections } from '../redux/appReducer';
import { useAppDispatch } from '../redux/hooks';


interface Props {
  x: number;
  y: number;
  value: number,
  highlight?: boolean;
  pin: Logic.InputPin | Logic.OutputPin;
  onmousedown?: FederatedEventHandler<FederatedPointerEvent>;
  onmouseup?: FederatedEventHandler<FederatedPointerEvent>;
}

const borderWidth = config.components.pin.borderWidth;
const width = config.components.pin.width;
const radius = width / 2;

export default function Pin(props: Props) {
  const { x, y, value, highlight, pin, onmousedown, onmouseup } = props;
  const dispatch = useAppDispatch();

  const [isMouseOver, setIsMouseOver] = useState(false);
  const [graphics, setGraphics] = useState<PIXI_Graphics | null>(null);

  const baseColor = value ? config.colors.on : config.colors.off;
  const mouseOverColor = value ? config.colors.mouseOver.on : config.colors.mouseOver.off;
  const fillColor = isMouseOver ? mouseOverColor : baseColor;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      if (!graphics) setGraphics(g);
      g.clear();
      g.beginFill(highlight ? config.colors.highlightBorder : config.colors.border);
      g.drawCircle(x, y, radius);
      g.beginFill(fillColor);
      g.drawCircle(x, y, radius - borderWidth);
      g.endFill();
    },
    [graphics, x, y, highlight, fillColor],
  );

  const pos = graphics?.toGlobal({ x, y });
  if (pin.position !== pos)
    pin.position = pos;

  useEffect(() => {
    dispatch(updateConnections());
  }, [dispatch, pos]);

  return <Graphics draw={draw} eventMode='dynamic'
    onmouseenter={() => setIsMouseOver(true)}
    onmouseleave={() => setIsMouseOver(false)}
    onmousedown={onmousedown || (() => { })}
    onmouseup={onmouseup || (() => { })} />;
}