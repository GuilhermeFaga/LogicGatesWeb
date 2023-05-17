import { Container } from "@pixi/react";
import { useAppSelector } from "../redux/hooks";
import VerticalBorder from "./VerticalBorder";


export default function SystemRightBorder() {
  const windowSize = useAppSelector(state => state.app.windowSize);
  const { width, height } = windowSize;

  return (
    <Container position={[width - 64, 0]}>
      <VerticalBorder height={height} />
    </Container>
  );
}