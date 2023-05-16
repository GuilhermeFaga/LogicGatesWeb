import * as Logic from '../logic';
import Pin from './Pin';


interface Props {
  x: number;
  y: number;
  inputPin: Logic.InputPin;
}

export default function InputPin(props: Props) {
  const { x, y, inputPin } = props;

  return <Pin x={x} y={y} value={inputPin.value} />;
}