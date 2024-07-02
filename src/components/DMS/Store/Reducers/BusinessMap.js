import { createSlice } from "@reduxjs/toolkit";

const initial = {
  isSideBarLoading: false,
  isSideBarColappsed: false,
  isFooterColappsed: true,
  isFooterLoading: false,
  tourSelected: "",
  customerSelected: "",
  tourList: [],
};

const reducer = createSlice({
  name: "DMSCustomers",
  initialState: { ...initial },
  reducers: {
    setSideBarLoading(state, action) {
      state.isSideBarLoading = action?.payload;
    },

    setIsSideBarColappsed(state, action) {
      state.isSideBarColappsed = action?.payload;
    },

    setFooterLoading(state, action) {
      state.isFooterLoading = action?.payload;
    },

    setIsFooterColappsed(state, action) {
      state.isFooterColappsed = action?.payload;
    },

    setCustomerSelected(state, action) {
      state.customerSelected = action?.payload;
    },

    setTourList(state, action) {
      state.tourList = action?.payload;
    },

    setTourSelected(state, action) {
      state.tourSelected = action?.payload;
    },

    reset: () => initial,
  },
});

export const { reducer: businessMapReducer, actions } = reducer;
