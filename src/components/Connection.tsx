import { useAppSelector } from "../redux/hooks";
import Line from "./Line";
import * as Logic from "../logic";


interface Props {
  input: Logic.InputPin;
  output: Logic.OutputPin;
}

export default function Connection(props: Props) {
  const { input, output } = props;
  const connectionsUpdate = useAppSelector(state => state.app.connectionsUpdate);
  console.assert(true, connectionsUpdate);

  if (!input.position || !output.position) return null;
  return <Line start={input.position} end={output.position} value={output.value} />;
}