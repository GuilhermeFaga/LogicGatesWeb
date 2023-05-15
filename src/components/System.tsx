import React, { useContext } from "react";
import { constants } from "../constants";
import { WindowContext } from "../contexts/WindowContext";
import * as Logic from "../logic";
import InputPin from "./InputPin";
import OutputPin from "./OutputPin";


interface Props {
  system: Logic.System;
  children: React.ReactNode;
}

export default function System(props: Props) {
  const { system, children } = props;

  const [width, height] = useContext(WindowContext);

  const pinWidth = constants.components.system.pinWidth;
  const pinRadius = pinWidth / 2;
  const pinGap = constants.components.system.pinGap;
  const len = system.systemInputs.length;
  const firstPinY = (height / 2) + (-(pinGap / 2 * (len - 1)) - (pinRadius * (len - 1)));

  const inputs = system.systemInputs.map((input, i) => {
    return <OutputPin key={i} x={54} y={firstPinY + (pinGap + pinRadius) * i} value={input.value} />;
  });

  const output = <InputPin x={width - 54} y={height / 2} value={system.getValue()} />;

  return (
    <>
      {inputs}
      {output}
      {children as React.ReactElement}
    </>
  );
}