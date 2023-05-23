import { Container, useApp } from "@pixi/react";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { clearSelectedChips, clearSelectedWires, handleSelectedChip, handleSelectedWire, setSelectedPin } from '../redux/appReducer';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Application, DisplayObject, Graphics, ICanvas } from "pixi.js";
import * as Logic from "../logic";
import { ThunkDispatch } from "@reduxjs/toolkit";

interface Props {
  onMouseDownRef: MutableRefObject<(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void>;
  onMouseUpRef: MutableRefObject<(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void>;
  onMouseMoveRef: MutableRefObject<(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void>;
}

export default function EventsController(props: Props) {
  const { onMouseDownRef, onMouseUpRef, onMouseMoveRef } = props;

  const app = useApp();
  const chips = useAppSelector(state => state.app.system.chips);
  const wires = useAppSelector(state => state.app.wires);

  const dispatch = useAppDispatch();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [initialCursorPosition, setInitialCursorPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    onMouseDownRef.current = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      onMouseDown(event);
    }
    onMouseUpRef.current = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      onMouseUp(event);
    }
    onMouseMoveRef.current = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      onMouseMove(event);
    }
  }, [initialCursorPosition, isMouseDown]);


  useEffect(() => {
    if (isDragging) {
      dispatch(clearSelectedChips());
      dispatch(clearSelectedWires());
    }
  }, [isDragging]);


  function onMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setIsMouseDown(true);
    setInitialCursorPosition({ x: event.clientX, y: event.clientY });
  }


  function onMouseUp(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {

    // if the mouse didn't move, then it's a click
    if (initialCursorPosition.x === event.clientX
      && initialCursorPosition.y === event.clientY) {
      onClick(event);
    }

    setIsMouseDown(false);
    setIsDragging(false);
    dispatch(setSelectedPin(null));
  }

  function onClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {


    let found = false;

    found = wiresSelectionHandler(event, dispatch, { app, wires });
    found = chipsSelectionHandler(event, dispatch, { chips }) || found;

    if (!found) {
      // if none of the chips or wires were selected, clear the selection
      dispatch(clearSelectedWires());
      dispatch(clearSelectedChips());
    }

  }

  function onMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (isMouseDown) {
      setIsDragging(true);
    }
  }

  return (
    <Container eventMode='dynamic'>
    </Container>
  );
}

function wiresSelectionHandler(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  dispatch: ThunkDispatch<any, any, any>,
  params: { app: Application<ICanvas>, wires: Logic.Wire[] }
) {

  const { app, wires } = params;

  let found = false;

  // check if the mouse if over a wire
  for (const wire of wires) {

    const wireGraphic = app.stage.getChildByName(wire.id) as Graphics;

    // convert the wire's points to screen coordinates
    const points: { x: number, y: number }[] = [];

    for (let i = 0; i < wireGraphic.geometry.points.length; i += 2) {
      const x = wireGraphic.geometry.points[i];
      const y = wireGraphic.geometry.points[i + 1];
      points.push({ x, y });
    }

    points.reverse();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const nextPoint = points[i + 1];

      if (!nextPoint) break;

      const threshold = 10;
      if (point.x - threshold <= event.clientX && event.clientX <= nextPoint.x + threshold
        && point.y - threshold <= event.clientY && event.clientY <= point.y + threshold) {
        const inputPosition = points[points.length - 1];
        const outputPosition = points[0]
        const logicWire = Logic.Wire.findWireFromPoints(wires, inputPosition, outputPosition);
        if (!logicWire) break;
        found = true;
        dispatch(handleSelectedWire(logicWire));
        dispatch(clearSelectedChips());
        break;
      }
    }
  }

  return found;
}

function chipsSelectionHandler(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  dispatch: ThunkDispatch<any, any, any>,
  params: { chips: Logic.Chip[] }
) {

  const { chips } = params;

  let found = false;

  // check if the mouse is over a chip
  for (const chip of chips) {
    if (!chip.rect) continue;
    if (chip.rect.contains(event.clientX, event.clientY)) {
      // if so, select it
      found = true;
      dispatch(handleSelectedChip(chip));
      dispatch(clearSelectedWires());
    }
  }

  return found;
}