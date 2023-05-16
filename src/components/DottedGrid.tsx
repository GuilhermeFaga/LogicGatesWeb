import { Graphics } from '@pixi/react';
import { Graphics as PIXI_Graphics } from "pixi.js";
import { useCallback } from "react";
import { constants } from '../constants';

interface Props {
  windowSize: [number, number];
}

export default function DottedGrid(props: Props) {
  const { windowSize } = props;

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.calculateBounds()
    let [w, h] = windowSize

    g.beginFill(constants.colors.dottedGrid);
    for (let i = 0; i < h; i += 20) {
      for (let j = 0; j < w; j += 20) {
        g.drawCircle(j, i, 1);
      }
    }
    g.endFill();


  }, [])

  return <Graphics draw={draw} />;
}