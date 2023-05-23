import * as Logic from "src/logic";
import { useAppSelector } from "src/redux/hooks";
import Line from "./Line";
import { useApp, useTick } from "@pixi/react";
import { useEffect, useState } from "react";


interface Props {
  wire: Logic.Wire;
}

export default function Wire(props: Props) {
  const { wire } = props;
  // eslint-disable-next-line
  const connectionsUpdate = useAppSelector(state => state.app.connectionsUpdate);

  const app = useApp();
  const selected = useAppSelector(state => state.app.selectedWires.includes(wire));

  const [component, setComponent] = useState(null as JSX.Element | null);

  const [inputPosition, setInputPosition] = useState(null as { x: number, y: number } | null);
  const [outputPosition, setOutputPosition] = useState(null as { x: number, y: number } | null);

  useEffect(() => {
    if (wire.input?.position) {
      setInputPosition(wire.input.position);
    }

    if (wire.output?.position) {
      setOutputPosition(wire.output.position);
    }
  }, [wire.input?.position, wire.output?.position]);

  useTick(() => {
    if (!wire.input?.position) {
      setInputPosition({ x: app.renderer.events.pointer.global.x, y: app.renderer.events.pointer.global.y });
    }
    if (!wire.output?.position) {
      setOutputPosition({ x: app.renderer.events.pointer.global.x, y: app.renderer.events.pointer.global.y });
    }
  });

  useEffect(() => {
    if (inputPosition && outputPosition) {
      setComponent(<Line id={wire.id} start={inputPosition} end={outputPosition} value={wire.output?.value || 0} selected={selected} />);
    }
  }, [inputPosition?.x, inputPosition?.y, outputPosition?.x, outputPosition?.y, selected, wire.output?.value]);

  return component;
}