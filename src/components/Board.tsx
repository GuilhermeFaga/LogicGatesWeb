import { Graphics } from '@pixi/react';
import { Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback } from 'react';
import { constants } from '../constants';


interface Props {
  height: number;
  width: number;
  color?: string;
}

const borderWidth = constants.components.board.borderWidth;
const borderRadius = constants.components.board.borderRadius;
const offset = constants.components.board.offset;

export default function Board(props: Props) {
  const { height, width, color } = props;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      g.clear();
      g.beginFill(constants.colors.border);
      g.drawRoundedRect(offset, offset, width, height, borderRadius);
      g.beginFill(color || constants.colors.board);
      g.drawRoundedRect(offset + borderWidth, offset + borderWidth, width - borderWidth * 2, height - borderWidth * 2, borderRadius / 2);
      g.endFill();

    },
    [height, width, color],
  );

  return (<Graphics draw={draw} />);
}