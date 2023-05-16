import { Graphics } from '@pixi/react';
import { FederatedEventHandler, FederatedPointerEvent, Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback, useEffect, useState } from 'react';
import { constants } from '../constants';
import * as Logic from '../logic';
import { useAppDispatch } from '../redux/hooks';
import { updateConnections } from '../redux/appReducer';


interface Props {
  x: number;
  y: number;
  value: number,
  highlight?: boolean;
  pin: Logic.InputPin | Logic.OutputPin;
  onmousedown?: FederatedEventHandler<FederatedPointerEvent>;
  onmouseup?: FederatedEventHandler<FederatedPointerEvent>;
}

const borderWidth = constants.components.pin.borderWidth;
const width = constants.components.pin.width;
const radius = width / 2;

export default function Pin(props: Props) {
  const { x, y, value, highlight, pin, onmousedown, onmouseup } = props;
  const dispatch = useAppDispatch();

  const [isMouseOver, setIsMouseOver] = useState(false);
  const [graphics, setGraphics] = useState<PIXI_Graphics | null>(null);

  const baseColor = value ? constants.colors.on : constants.colors.off;
  const mouseOverColor = value ? constants.colors.mouseOver.on : constants.colors.mouseOver.off;
  const fillColor = isMouseOver ? mouseOverColor : baseColor;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      if (!graphics) setGraphics(g);
      g.clear();
      g.beginFill(highlight ? constants.colors.highlightBorder : constants.colors.border);
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