import { Container } from '@pixi/react';
import { constants } from '../constants';
import * as Logic from '../logic';
import Board from './Board';
import InputPin from './InputPin';
import OutputPin from './OutputPin';


interface Props {
  chip: Logic.Chip;
  x: number;
  y: number;
  color?: string;
}

const width = 150;

export default function Chip(props: Props) {
  const { chip, x, y, color } = props;

  const padding = constants.components.gate.padding;
  const pinOffset = constants.components.gate.pinOffset;
  const pinWidth = constants.components.gate.pinWidth;
  const pinGap = constants.components.gate.pinGap;

  const height = padding * 2 + (chip.inputs.length * pinWidth) + ((chip.inputs.length > 1 ? Math.ceil(chip.inputs.length / 2) : 0) * pinGap);

  const inputs = chip.inputs.map((input, i) => {
    return <InputPin x={pinWidth / 2} y={padding + pinOffset + ((pinWidth + pinGap) * i)} value={input.value} />;
  });

  const output = <OutputPin x={width} y={height / 2 + 8} value={chip.getOutputValue()} />;

  return (
    <Container position={[x, y]}>
      <Board height={height} width={width} color={color} />
      {inputs}
      {output}
    </Container>
  );
}
