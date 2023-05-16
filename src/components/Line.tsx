import { Graphics } from "@pixi/react";
import { Graphics as PIXI_Graphics, LINE_JOIN } from "pixi.js";
import { useCallback } from "react";
import { constants } from "../constants";


interface Props {
  start: { x: number, y: number };
  end: { x: number, y: number };
}

export default function Line(props: Props) {
  const { start, end } = props;

  const xDist = Math.abs(end.x - start.x);
  const yDist = Math.abs(end.y - start.y);

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.lineStyle({ width: 5, color: constants.colors.connection, alpha: 1, join: LINE_JOIN.ROUND });

    g.moveTo(start.x, start.y);

    if (xDist > yDist) {
      g.lineTo(end.x - xDist / 2, start.y);
      g.lineTo(end.x - xDist / 2, end.y);
    } else {
      g.lineTo(start.x, end.y - yDist / 2);
      g.lineTo(end.x, end.y - yDist / 2);
    }
    g.lineTo(end.x, end.y);
  }, [start, end, xDist, yDist]);

  return <Graphics draw={draw} />;
}