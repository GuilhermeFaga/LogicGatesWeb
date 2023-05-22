import { Container } from "@pixi/react";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { clearSelectedChips, handleSelectedChip, setSelectedPin } from '../redux/appReducer';
import { useAppDispatch, useAppSelector } from "../redux/hooks";


interface Props {
  onMouseDownRef: MutableRefObject<(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void>;
  onMouseUpRef: MutableRefObject<(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void>;
}

export default function EventsController(props: Props) {
  const { onMouseDownRef, onMouseUpRef } = props;
  const chips = useAppSelector(state => state.app.system.chips);

  const dispatch = useAppDispatch();

  const [initialCursorPosition, setInitialCursorPosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    onMouseDownRef.current = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      onMouseDown(event);
    }
    onMouseUpRef.current = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      onMouseUp(event);
    }
  }, [initialCursorPosition]);


  function onMouseDown(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setInitialCursorPosition({ x: event.clientX, y: event.clientY });
  }


  const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {

    // if the mouse didn't move, then it's a click
    if (initialCursorPosition.x === event.clientX
      && initialCursorPosition.y === event.clientY) {

      let found = false;

      // check if the mouse is over a chip
      for (const chip of chips) {
        if (!chip.rect) continue;
        if (chip.rect.contains(event.clientX, event.clientY)) {
          // if so, select it
          console.log(chip);
          found = true;
          dispatch(handleSelectedChip(chip));
        }
      }

      if (!found) {
        // if none of the chips were selected, clear the selection
        dispatch(clearSelectedChips());
      }
    }

    dispatch(setSelectedPin(null));
  }


  return (
    <Container eventMode='dynamic'>
    </Container>
  );
}
