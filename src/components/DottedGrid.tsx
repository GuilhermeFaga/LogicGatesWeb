import { Graphics } from '@pixi/react';
import { Graphics as PIXI_Graphics } from "pixi.js";
import { useCallback } from "react";
import { config } from 'src/config';
import { useAppSelector } from 'src/redux/hooks';


export default function DottedGrid() {
  const windowSize = useAppSelector(state => state.app.windowSize);
  let { width, height } = windowSize;

  const draw = useCallback((g: PIXI_Graphics) => {
    g.clear();
    g.calculateBounds()

    g.beginFill(config.colors.dottedGrid);
    for (let i = 0; i < height; i += config.components.dottedGrid.gap) {
      for (let j = 0; j < width; j += config.components.dottedGrid.gap) {
        g.drawCircle(j, i, config.components.dottedGrid.dotSize);
      }
    }
    g.endFill();


  }, [width, height])

  return <Graphics draw={draw} />;
}