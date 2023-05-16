import { useEffect } from "react";
import { constants } from "../constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Chip from "./Chip";
import InputPin from "./InputPin";
import OutputPin from "./OutputPin";
import { addChip } from "../redux/appReducer";
import * as Logic from "../logic";
import Connection from "./Connection";


interface Props {
  windowSize: [number, number];
}

export default function System(props: Props) {
  const system = useAppSelector(state => state.app.system);
  const systemUpdate = useAppSelector(state => state.app.systemUpdate);
  console.assert(true, systemUpdate);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      system.setInputValue(1, 1);
      dispatch(addChip(new Logic.NotGate()))
    }
  }, [system, dispatch]);

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

  // Get connections between chips and system inputs/outputs
  const links = system.chips.flatMap((chip) => {
    return chip.inputs.flatMap((input) => {
      return input.connections.map((connection) => {
        return {
          input,
          output: connection
        };
      });
    });
  });

  // Add system output connections to the existing connections
  if (system.systemOutput.connections.length > 0) {
    links.push(
      ...system.systemOutput.connections.map((connection) => ({
        input: system.systemOutput,
        output: connection
      }))
    );
  }

  // sort array links by output value
  links.sort((a, b) => {
    return a.output.value - b.output.value;
  });

  const connections = links.map((link, i) => {
    if (!link.input.position || !link.output.position) return null;
    return <Connection key={i} input={link.input} output={link.output} />;
  });

  return (
    <>
      {connections}
      {chips}
      {inputs}
      {output}
    </>
  );
}