import { createSlice } from "@reduxjs/toolkit";

const initial = {
  currentOrder: 1,
  listOrder: [1],
  isScanning: false,
  fetchListParams: {
    so_ct: "",
    ngay_ct: "",
    ma_kh: "",
    ten_kh: "",
    dien_thoai: "",
    pageIndex: 1,
    pageSize: 10,
  },
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

    setFetchListParams: (state, action) => {
      state.fetchListParams = action?.payload;
    },

    resetFetchListParams: (state, action) => {
      state.fetchListParams = initial.fetchListParams;
    },

    reset: () => initial,
  },
});

export const { actions: retailOrderActions, reducer: retailOrderReducer } =
  retailOrderSlice;
