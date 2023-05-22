import { Container } from "@pixi/react";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import VerticalBorder from "./VerticalBorder";
import Slider from "./Slider";
import { update } from "src/redux/appReducer";


export default function SystemLeftBorder() {
  const windowSize = useAppSelector(state => state.app.windowSize);
  const { height } = windowSize;

  const system = useAppSelector(state => state.app.system);
  const systemInputs = system.systemInputs;

  const dispatch = useAppDispatch();

  return (
    <Container position={[0, 0]}>
      <VerticalBorder height={height} />
      {systemInputs.map((input, i) => {
        if (!input.position) return null;
        return (
          <Container key={i} position={{ x: 4, y: input.position.y - 8 }}>
            <Slider initialState={!!input.value} onChange={(value) => {
              system.setInputValue(i, value ? 1 : 0);
              dispatch(update());
            }} />
          </Container>
        )
      })}

    </Container>
  );
}