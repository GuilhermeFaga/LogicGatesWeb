import Pin from './Pin';


interface Props {
  x: number;
  y: number;
  value: number;
}

export default function InputPin(props: Props) {
  const { x, y, value } = props;

  return <Pin x={x} y={y} value={value} />;
}