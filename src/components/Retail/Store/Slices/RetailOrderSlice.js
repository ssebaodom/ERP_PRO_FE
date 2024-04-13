import { createSlice } from "@reduxjs/toolkit";

const initial = {
  currentOrder: 1,
  listOrder: [1],
  isScanning: false,
};

const retailOrderSlice = createSlice({
  name: "retailOrder",
  initialState: initial,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action?.payload;
    },

    setIsScanning: (state, action) => {
      state.isScanning = action?.payload;
    },

    setListOrder: (state, action) => {
      state.listOrder = action?.payload;
    },
    reset: () => initial,
  },
});

export const { actions: retailOrderActions, reducer: retailOrderReducer } =
  retailOrderSlice;
