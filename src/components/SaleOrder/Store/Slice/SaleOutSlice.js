import { createSlice } from "@reduxjs/toolkit";

const saleOutOrderDetailInitial = {
  currentMasterItem: {},
  currentDetailItem: [],
  finalDetails: [],
};

const saleoutDetails = createSlice({
  name: "saleoutDetails",
  initialState: { ...saleOutOrderDetailInitial },
  reducers: {
    setMasterLayout(state, action) {
      state.masterLayout = action?.payload;
    },
    setCurrentMasterSaleOut(state, action) {
      state.currentMasterItem = action?.payload;
    },
    setCurrentDetailSaleOut(state, action) {
      state.currentDetailItem = action?.payload;
    },
    setFinalDetails(state, action) {
      state.finalDetails = action?.payload;
    },
  },
});

export const { reducer: saleoutDetailsReducer, actions } = saleoutDetails;
