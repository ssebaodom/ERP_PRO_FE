import { createSlice } from "@reduxjs/toolkit";

const ApproveItemsInitial = {
  detailData: [],
};

const approveItems = createSlice({
  name: "tourDetails",
  initialState: { ...ApproveItemsInitial },
  reducers: {
    setDetailData(state, action) {
      state.detailData = action?.payload;
    },
  },
});

export const { reducer: approveItemsReducer, actions } = approveItems;
