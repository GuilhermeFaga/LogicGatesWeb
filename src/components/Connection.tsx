import * as Logic from "src/logic";
import { useAppSelector } from "src/redux/hooks";
import Line from "./Line";


interface Props {
  input: Logic.InputPin;
  output: Logic.OutputPin;
}

export default function Connection(props: Props) {
  const { input, output } = props;
  // eslint-disable-next-line
  const connectionsUpdate = useAppSelector(state => state.app.connectionsUpdate);

  if (!input.position || !output.position) return null;
  return <Line start={input.position} end={output.position} value={output.value} />;
}