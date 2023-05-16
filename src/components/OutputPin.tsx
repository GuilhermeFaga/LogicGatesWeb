import * as Logic from '../logic';
import Pin from './Pin';


interface Props {
  x: number;
  y: number;
  outputPin: Logic.OutputPin;
}

export default function OutputPin(props: Props) {
  const { x, y, outputPin } = props;

  return <Pin x={x} y={y} value={outputPin.value}
    onmousedown={(event) => {
      console.log(event);
    }}
    onmouseup={(event) => {

    }} />;
}