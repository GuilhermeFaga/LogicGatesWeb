import { Graphics } from "@pixi/react";
import { LINE_JOIN, Graphics as PIXI_Graphics } from "pixi.js";
import { useCallback } from "react";
import { config } from "../config";


interface Props {
  start: { x: number, y: number };
  end: { x: number, y: number };
  value: number;
}

export default function Line(props: Props) {
  const { start, end, value } = props;

  const xDist = end.x - start.x;
  const yDist = end.y - start.y;

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.lineStyle({
      width: 5,
      color: value ? config.colors.on : config.colors.connection,
      alpha: 1,
      join: LINE_JOIN.ROUND
    });

    g.moveTo(start.x, start.y);

    if (xDist < yDist) {
      g.lineTo(end.x - xDist / 2, start.y);
      g.lineTo(end.x - xDist / 2, end.y);
    } else {
      g.lineTo(start.x, end.y - yDist / 2);
      g.lineTo(end.x, end.y - yDist / 2);
    }

    g.lineTo(end.x, end.y);
  }, [start, end, xDist, yDist, value]);

  return <Graphics draw={draw} />;
}