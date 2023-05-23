import * as Logic from 'src/logic';
import { setSelectedPin, setTempWire, update } from 'src/redux/appReducer';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
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
      dispatch(setSelectedPin(outputPin));
      dispatch(setTempWire(new Logic.Wire("tempWire", undefined, outputPin)));
    }}
    onmouseup={(event) => {
      if (selectedPin instanceof Logic.InputPin) {
        outputPin.connect(selectedPin as Logic.InputPin);
        dispatch(update());
      }
    }} />;
}