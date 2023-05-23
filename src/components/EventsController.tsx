import { Container, useApp, useTick } from "@pixi/react";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { clearSelectedChips, clearSelectedWires, handleSelectedChip, handleSelectedWire, setSelectedPin, setTempWire } from '../redux/appReducer';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Application, DisplayObject, Graphics, ICanvas, Rectangle } from "pixi.js";
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

  const selectedWires = useAppSelector(state => state.app.selectedWires);

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
      // dispatch(clearSelectedChips());
      // dispatch(clearSelectedWires());
    }
  }, [isDragging]);


  useTick((delta) => {
    if (isDragging) {

      if (selectedWires.length <= 1) {

        // if there is no wire selected, then check if the mouse is over a wire
        if (selectedWires.length === 0) {
          for (const wire of wires) {
            // check if the mouse if over a wire
            if (isPointInWire(app, { x: initialCursorPosition.x, y: initialCursorPosition.y }, wire)) {
              // if so, select it
              dispatch(handleSelectedWire(wire));
              dispatch(clearSelectedChips());
              break;
            }
          }
        } else {
          // if there is only one wire selected, then drag it
          const wire = selectedWires[0];
          if (isPointInWire(app, { x: initialCursorPosition.x, y: initialCursorPosition.y }, wire)) {
            console.log('dragging wire');
          }
        }
      }
    }
  });


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
    dispatch(setTempWire(null));
  }

  function onClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {


    let found = false;

    found = wiresSelectionHandler(event, dispatch, { app, wires });
    found = chipsSelectionHandler(event, dispatch, { app, chips }) || found;

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

  for (const wire of wires) {

    // check if the mouse if over a wire
    if (isPointInWire(app, { x: event.clientX, y: event.clientY }, wire)) {
      // if so, select it
      found = true;
      dispatch(handleSelectedWire(wire));
      dispatch(clearSelectedChips());
      break;
    }
  }

  return found;
}

function isPointInWire(app: Application<ICanvas>, _point: { x: number, y: number }, wire: Logic.Wire) {
  const wireGraphic = app.stage.getChildByName(wire.id) as Graphics;
  if (!wireGraphic) return false;

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
    if (point.x - threshold <= _point.x && _point.x <= nextPoint.x + threshold
      && point.y - threshold <= _point.y && _point.y <= point.y + threshold) {
      return true;
    }
  }

  return false;
}

function chipsSelectionHandler(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  dispatch: ThunkDispatch<any, any, any>,
  params: { app: Application<ICanvas>, chips: Logic.Chip[] }
) {

  const { app, chips } = params;

  let found = false;

  // check if the mouse is over a chip
  for (const chip of chips) {

    const chipRect = (app.stage.getChildByName(chip.id) as DisplayObject).getBounds() as Rectangle;
    if (!chipRect) continue;

    if (chipRect.contains(event.clientX, event.clientY)) {
      // if so, select it
      found = true;
      dispatch(handleSelectedChip(chip));
      dispatch(clearSelectedWires());
    }
  }

  return found;
}