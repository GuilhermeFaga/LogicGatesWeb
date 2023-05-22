import { Graphics } from '@pixi/react';
import { FederatedEventHandler, FederatedPointerEvent, Graphics as PIXI_Graphics } from 'pixi.js';
import { useCallback } from 'react';
import { config } from 'src/config';


interface Props {
  height: number;
  width: number;
  color?: string;
  selected?: boolean;
  onmousedown?: FederatedEventHandler<FederatedPointerEvent>;
  onmouseup?: FederatedEventHandler<FederatedPointerEvent>;
  onclick?: FederatedEventHandler<FederatedPointerEvent>;
  onmousemove?: FederatedEventHandler<FederatedPointerEvent>;
}

const borderWidth = config.components.board.borderWidth;
const borderRadius = config.components.board.borderRadius;
const offset = config.components.board.offset;

export default function Board(props: Props) {
  const { height, width, color, selected, onmousedown, onmouseup, onclick, onmousemove } = props;

  const draw = useCallback(
    (g: PIXI_Graphics) => {
      g.clear();
      g.beginFill(selected ? config.colors.selectedBorder : config.colors.border);
      g.drawRoundedRect(offset, offset, width, height, borderRadius);
      g.beginFill(color || config.colors.board);
      g.drawRoundedRect(offset + borderWidth, offset + borderWidth, width - borderWidth * 2, height - borderWidth * 2, borderRadius / 2);
      g.endFill();

    },
    [height, width, color, selected],
  );

  return (
    <Graphics draw={draw}
      eventMode='dynamic'
      onclick={onclick || null}
      onmousemove={onmousemove || null}
      onmousedown={onmousedown || null}
      onmouseup={onmouseup || null} />
  );
}

// TODO Add text to the board