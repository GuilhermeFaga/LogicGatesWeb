import { useEffect } from "react";
import { config } from "src/config";
import * as Logic from "src/logic";
import { addChip, setWindowSize } from "src/redux/appReducer";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import Chip from "./Chip";
import Connection from "./Connection";
import InputPin from "./InputPin";
import OutputPin from "./OutputPin";
import SystemHud from "./SystemHud";


export default function System() {
  const windowSize = useAppSelector(state => state.app.windowSize);
  const system = useAppSelector(state => state.app.system);
  // eslint-disable-next-line
  const systemUpdate = useAppSelector(state => state.app.systemUpdate);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      window.addEventListener('resize', () => {
        dispatch(setWindowSize({ width: window.innerWidth, height: window.innerHeight }));
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      system.setInputValue(1, 1);
      dispatch(addChip(new Logic.NotGate()))
      dispatch(addChip(new Logic.AndGate()))
    }
  }, [system, dispatch]);

  const { width, height } = windowSize;

  const pinWidth = config.components.system.pinWidth;
  const pinRadius = pinWidth / 2;
  const pinGap = config.components.system.pinGap;
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
      <SystemHud />
      {inputs}
      {output}
    </>
  );
}