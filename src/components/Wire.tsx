import * as Logic from "src/logic";
import { useAppSelector } from "src/redux/hooks";
import Line from "./Line";


interface Props {
  wire: Logic.Wire;
}

export default function Wire(props: Props) {
  const { wire } = props;
  // eslint-disable-next-line
  const connectionsUpdate = useAppSelector(state => state.app.connectionsUpdate);

  const selected = useAppSelector(state => state.app.selectedWires.includes(wire));

  if (!wire.input.position || !wire.output.position) return null;
  return <Line id={wire.id} start={wire.input.position} end={wire.output.position} value={wire.output.value} selected={selected} />;
}