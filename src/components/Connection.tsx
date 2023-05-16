import Line from "./Line";


interface Props {
  start: { x: number, y: number };
  end: { x: number, y: number };
}

export default function Connection(props: Props) {
  return <Line start={props.start} end={props.end} />;
}