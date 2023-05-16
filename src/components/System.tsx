import { useEffect } from "react";
import { constants } from "../constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Chip from "./Chip";
import InputPin from "./InputPin";
import OutputPin from "./OutputPin";
import { addChip } from "../redux/appReducer";
import * as Logic from "../logic";


interface Props {
  windowSize: [number, number];
}

export default function System(props: Props) {
  const app = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const { system } = app;

  useEffect(() => {
    return () => {
      dispatch(addChip(new Logic.NotGate()))
    }
  }, []);

  const [width, height] = props.windowSize;

  const pinWidth = constants.components.system.pinWidth;
  const pinRadius = pinWidth / 2;
  const pinGap = constants.components.system.pinGap;
  const len = system.systemInputs.length;
  const firstPinY = (height / 2) + (-(pinGap / 2 * (len - 1)) - (pinRadius * (len - 1)));

  const inputs = system.systemInputs.map((input, i) => {
    return <OutputPin key={i} x={54} y={firstPinY + (pinGap + pinRadius) * i} outputPin={input} />;
  });

  const output = <InputPin x={width - 54} y={height / 2} inputPin={system.systemOutput} />;

  const chips = system.chips.map((chip, i) => {
    return <Chip key={i} x={0} y={0} chip={chip} />;
  })

  return (
    <>
      {chips}
      {inputs}
      {output}
    </>
  );
}