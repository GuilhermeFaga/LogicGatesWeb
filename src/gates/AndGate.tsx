import { useState } from "react";
import Chip from "../components/Chip";
import { constants } from "../constants";
import * as Logic from '../logic';


interface Props {
  x: number;
  y: number;
}

export default function AndGate(props: Props) {
  const [chip] = useState(new Logic.AndGate());
  const { x, y } = props;

  return <Chip chip={chip} x={x} y={y} color={constants.colors.andGate} />;
}