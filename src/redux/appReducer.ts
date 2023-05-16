import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import * as Logic from "../logic";

// Define a type for the slice state
interface AppState {
  system: Logic.System;
  selectedPin: Logic.InputPin | Logic.OutputPin | null;
  systemUpdate: number;
  connectionsUpdate: number;
}

// Define the initial state using that type
const initialState: AppState = {
  system: new Logic.System(2),
  selectedPin: null,
  systemUpdate: 0,
  connectionsUpdate: 0
}

export const appSlice = createSlice({
  name: 'app',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
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

export const { setSystem, setSelectedPin, addChip, update, updateConnections } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app

export default appSlice.reducer