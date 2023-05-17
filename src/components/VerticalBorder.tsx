import { Graphics } from "@pixi/react";
import { Graphics as PIXI_Graphics } from "pixi.js";
import { useCallback } from "react";


interface Props {
  windowHeight: number;
}

export default function VerticalBorder(props: Props) {

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.beginFill(0x000000);
    g.drawRect(0, 0, 64, props.windowHeight);
  }, []);

  return <Graphics draw={draw} />;
}