import * as Logic from '../logic';
import { setSelectedPin, update } from '../redux/appReducer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Pin from './Pin';


interface Props {
  x: number;
  y: number;
  inputPin: Logic.InputPin;
}

export default function InputPin(props: Props) {
  const { x, y, inputPin } = props;
  const selectedPin = useAppSelector(state => state.app.selectedPin);
  const dispatch = useAppDispatch();

  const highlight = selectedPin instanceof Logic.OutputPin;

  return <Pin pin={inputPin} x={x} y={y} value={inputPin.value} highlight={highlight}
    onmousedown={(event) => {
      console.log(event);
      dispatch(setSelectedPin(inputPin));
    }}
    onmouseup={(event) => {
      if (selectedPin instanceof Logic.OutputPin) {
        inputPin.connect(selectedPin as Logic.OutputPin);
        dispatch(update());
      }
    }} />;
}