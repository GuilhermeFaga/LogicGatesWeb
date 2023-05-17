import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import * as Logic from "src/logic";
import type { RootState } from './store';


export interface WindowSize {
  width: number;
  height: number;
}

// Define a type for the slice state
interface AppState {
  system: Logic.System;
  selectedPin: Logic.InputPin | Logic.OutputPin | null;
  systemUpdate: number;
  connectionsUpdate: number;
  windowSize: WindowSize;
}

// Define the initial state using that type
const initialState: AppState = {
  system: new Logic.System(2),
  selectedPin: null,
  systemUpdate: 0,
  connectionsUpdate: 0,
  windowSize: { width: window.innerWidth, height: window.innerHeight }
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setWindowSize: (state, action: PayloadAction<WindowSize>) => {
      state.windowSize = action.payload;
    },
    setSystem: (state, action: PayloadAction<Logic.System>) => {
      state.system = action.payload;
    },
    setSelectedPin: (state, action: PayloadAction<Logic.InputPin | Logic.OutputPin | null>) => {
      state.selectedPin = action.payload;
    },
    addChip: (state, action: PayloadAction<Logic.Chip>) => {
      state.system.addChip(action.payload);
      state.systemUpdate += 1
    },
    update: (state) => {
      state.system.update();
      state.systemUpdate += 1;
    },
    updateConnections: (state) => {
      state.connectionsUpdate += 1;
    }
  },
})

export const { setWindowSize, setSystem, setSelectedPin, addChip, update, updateConnections } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app

export default appSlice.reducer