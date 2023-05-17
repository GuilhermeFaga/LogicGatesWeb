import { Container } from "@pixi/react";
import { useAppSelector } from "../redux/hooks";
import VerticalBorder from "./VerticalBorder";


export default function SystemLeftBorder() {
  const windowSize = useAppSelector(state => state.app.windowSize);
  const { height } = windowSize;

  return (
    <Container position={[0, 0]}>
      <VerticalBorder windowHeight={height} />
    </Container>
  );
}