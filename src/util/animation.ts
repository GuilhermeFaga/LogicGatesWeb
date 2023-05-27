import { useTick } from "@pixi/react";
import { Point } from "pixi.js";
import { useState } from "react";


function instanceOfPoint(object: any): object is Point {
  return 'x' in object && 'y' in object;
}

function useAnimation(initialState: number, animationTime: number): [number, (newState: number) => void];
function useAnimation(initialState: Point, animationTime: number): [Point, (newState: Point) => void];

function useAnimation(initialState: any, animationTime = 1) {
  const [state, _setState] = useState(initialState);
  const [tempState, setTempState] = useState(initialState);
  const [nextState, setNextState] = useState(initialState);

  const setState = (newState: typeof initialState) => {
    console.log(state, newState)
    setTempState(state);
    setNextState(newState);
  }

  useTick((delta) => {
    if (nextState !== state) {

      if (typeof initialState === "number") {
        if (nextState > tempState) {
          if (nextState <= state) _setState(nextState);
          else _setState(state + delta / animationTime);
        } else {
          if (nextState >= state) _setState(nextState);
          else _setState(state - delta / animationTime);
        }
      } else if (instanceOfPoint(initialState)) {

        let { x, y } = state;

        if (nextState.x > tempState.x) {
          if (nextState.x <= state.x) x = nextState.x;
          else x = state.x + delta / animationTime;
        } else if (nextState.x < tempState.x) {
          if (nextState.x >= state.x) x = nextState.x;
          else x = state.x - delta / animationTime;
        }

        if (nextState.y > tempState.y) {
          if (nextState.y <= state.y) y = nextState.y;
          else y = state.y + delta / animationTime;
        } else if (nextState.y < tempState.y) {
          if (nextState.y >= state.y) y = nextState.y;
          else y = state.y - delta / animationTime;
        }

        _setState(new Point(x, y));
      }

    }
  });

  return [state, setState];
}


export { useAnimation };
