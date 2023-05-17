import { useCallback, useState } from "react";
import { Container, Graphics, useTick } from "@pixi/react";
import { Graphics as PIXI_Graphics, Point } from "pixi.js";
import { config } from "src/config";


interface Props {
  initialState?: boolean;
  onChange?: (value: boolean) => void;
}

export default function Slider(props: Props) {
  const [value, setValue] = useState(props.initialState || false);

  return <Container eventMode='dynamic'
    onclick={() => {
      setValue(!value);
      props.onChange?.(!value);
    }}>
    <SliderBox value={value} />
    <SliderDot value={value} />
  </Container>
}

function SliderBox({ value }: { value: boolean }) {
  const [state, setState] = useState(value);
  const [alpha, setAlpha] = useState(value ? 1 : 0);

  useTick((delta) => {
    if (state !== value) {
      if (value) {
        setAlpha(alpha + delta * 5);
        if (alpha >= 1)
          setState(value);
      } else {
        setAlpha(alpha - delta * 5);
        if (alpha <= 0)
          setState(value);
      }
    }
  });

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.beginFill(config.colors.darkOff);
    g.drawRoundedRect(0, 0, 32, 16, 10);
    g.endFill();

    g.beginFill(config.colors.darkOn, alpha);
    g.drawRoundedRect(0, 0, 32, 16, 10);
    g.endFill();
  }, [alpha]);

  return <Graphics draw={draw} />
}

function SliderDot({ value }: { value: boolean }) {
  const [state, setState] = useState(value);
  const falsePosition = new Point(8, 8);
  const truePosition = new Point(24, 8);
  const [position, setPosition] = useState(value ? truePosition : falsePosition);

  useTick((delta) => {
    if (state !== value) {
      let targetPosition = value ? truePosition : falsePosition;
      if (targetPosition === truePosition) {
        if (position.x < targetPosition.x)
          setPosition(new Point(position.x + delta * 5, position.y))
        if (position.x >= targetPosition.x)
          setState(value);
      } else {
        if (position.x > targetPosition.x)
          setPosition(new Point(position.x - delta * 5, position.y))
        if (position.x <= targetPosition.x)
          setState(value);
      }
    }
  });

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();

    g.beginFill(config.colors.off);
    g.drawCircle(position.x, position.y, 6);
    g.endFill();

    g.beginFill(config.colors.on, (position.x - 8) / (truePosition.x - 8));
    g.drawCircle(position.x, position.y, 6);
    g.endFill();
  }, [position.x, position.y, truePosition.x]);

  return <Graphics draw={draw} />
}