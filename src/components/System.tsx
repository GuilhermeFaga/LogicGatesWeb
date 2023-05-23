import { useEffect } from "react";
import { config } from "src/config";
import * as Logic from "src/logic";
import { addChip, setWindowSize, setWires } from "src/redux/appReducer";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import Chip from "./Chip";
import Wire from "./Wire";
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
    let x = 54;
    let y = firstPinY + (pinGap + pinRadius) * i;
    input.position = { x, y };
    return <OutputPin key={i} x={x} y={y} outputPin={input} />;
  });

  system.systemOutput.position = { x: width - 54, y: height / 2 };
  const output = <InputPin x={width - 54} y={height / 2} inputPin={system.systemOutput} />;

  const chips = system.chips.map((chip, i) => {
    return <Chip key={i} x={0} y={0} chip={chip} />;
  })

  const wires: Logic.Wire[] = []

  // Get connections between chips and system inputs/outputs
  for (const chip of system.chips) {
    for (const input of chip.inputs) {
      for (const connection of input.connections) {
        wires.push(new Logic.Wire(`wire_${wires.length}`, input, connection));
      }
    }
  }

  // Add system output connections to the existing connections
  if (system.systemOutput.connections.length > 0) {
    wires.push(
      ...system.systemOutput.connections.map((connection) =>
        new Logic.Wire(`wire_${wires.length}`, system.systemOutput, connection))
    );
  }

  // sort array links by output value
  wires.sort((a, b) => {
    return a.output.value - b.output.value;
  });

  const connections = wires.map((wire, i) => {
    if (!wire.input.position || !wire.output.position) return null;
    return <Wire key={i} wire={wire} />;
  });

  useEffect(() => {
    dispatch(setWires(wires));
  }, [wires]);

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