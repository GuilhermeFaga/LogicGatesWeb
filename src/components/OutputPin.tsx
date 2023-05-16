import * as Logic from '../logic';
import { setSelectedPin, update } from '../redux/appReducer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Pin from './Pin';


interface Props {
  x: number;
  y: number;
  outputPin: Logic.OutputPin;
}

export default function OutputPin(props: Props) {
  const { x, y, outputPin } = props;
  const selectedPin = useAppSelector(state => state.app.selectedPin);
  const dispatch = useAppDispatch();

  const highlight = selectedPin instanceof Logic.InputPin;

  return <Pin pin={outputPin} x={x} y={y} value={outputPin.value} highlight={highlight}
    onmousedown={(event) => {
      console.log(event);
      dispatch(setSelectedPin(outputPin));
    }}
    onmouseup={(event) => {
      if (selectedPin instanceof Logic.InputPin) {
        outputPin.connect(selectedPin as Logic.InputPin);
        dispatch(update());
      }
    }} />;
}