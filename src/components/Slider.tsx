import { Container, Graphics } from "@pixi/react";
import { Graphics as PIXI_Graphics, Point } from "pixi.js";
import { useCallback, useEffect, useState } from "react";
import { config } from "src/config";
import { useAnimation } from "src/util/animation";


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
  const [alpha, setAlpha] = useAnimation(value ? 1 : 0, 10);

  useEffect(() => {
    if (value) {
      setAlpha(1);
    } else {
      setAlpha(0);
    }
    // eslint-disable-next-line
  }, [value]);

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

const truePosition = new Point(24, 8);
const falsePosition = new Point(8, 8);

function SliderDot({ value }: { value: boolean }) {
  const [position, setPosition] = useAnimation(value ? truePosition : falsePosition, 0.2);

  useEffect(() => {
    if (value) {
      setPosition(truePosition);
    } else {
      setPosition(falsePosition);
    }
    // eslint-disable-next-line
  }, [value]);


  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();

    g.beginFill(config.colors.off);
    g.drawCircle(position.x, position.y, 6);
    g.endFill();

    g.beginFill(config.colors.on, (position.x - 8) / (truePosition.x - 8));
    g.drawCircle(position.x, position.y, 6);
    g.endFill();
  }, [position.x, position.y]);

  return <Graphics draw={draw} />
}