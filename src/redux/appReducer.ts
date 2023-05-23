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
  wires: Logic.Wire[];
  selectedPin: Logic.InputPin | Logic.OutputPin | null;
  selectedChips: Logic.Chip[];
  selectedWires: Logic.Wire[];
  systemUpdate: number;
  connectionsUpdate: number;
  windowSize: WindowSize;
}

// Define the initial state using that type
const initialState: AppState = {
  system: new Logic.System(2),
  wires: [],
  selectedPin: null,
  selectedChips: [],
  selectedWires: [],
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
    setWires: (state, action: PayloadAction<Logic.Wire[]>) => {
      state.wires = action.payload;
    },
    setSelectedPin: (state, action: PayloadAction<Logic.InputPin | Logic.OutputPin | null>) => {
      state.selectedPin = action.payload;
    },
    handleSelectedWire: (state, action: PayloadAction<Logic.Wire>) => {
      if (state.selectedWires.includes(action.payload)) {
        state.selectedWires = state.selectedWires.filter(wire => wire !== action.payload);
      } else {
        state.selectedWires = [action.payload];
      }
    },
    addSelectedWire: (state, action: PayloadAction<Logic.Wire>) => {
      state.selectedWires.push(action.payload);
    },
    removeSelectedWire: (state, action: PayloadAction<Logic.Wire>) => {
      state.selectedWires = state.selectedWires.filter(wire => wire !== action.payload);
    },
    clearSelectedWires: (state) => {
      state.selectedWires = [];
    },
    handleSelectedChip: (state, action: PayloadAction<Logic.Chip>) => {
      if (state.selectedChips.includes(action.payload)) {
        state.selectedChips = state.selectedChips.filter(chip => chip !== action.payload);
      } else {
        state.selectedChips = [action.payload];
      }
    },
    addSelectedChip: (state, action: PayloadAction<Logic.Chip>) => {
      state.selectedChips.push(action.payload);
    },
    removeSelectedChip: (state, action: PayloadAction<Logic.Chip>) => {
      state.selectedChips = state.selectedChips.filter(chip => chip !== action.payload);
    },
    clearSelectedChips: (state) => {
      state.selectedChips = [];
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

export const {
  setWindowSize,
  setSystem,
  setWires,
  setSelectedPin,
  handleSelectedWire,
  addSelectedWire,
  removeSelectedWire,
  clearSelectedWires,
  handleSelectedChip,
  addSelectedChip,
  removeSelectedChip,
  clearSelectedChips,
  addChip,
  update,
  updateConnections
} = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectApp = (state: RootState) => state.app

export default appSlice.reducer