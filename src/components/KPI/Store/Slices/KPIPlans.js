import { createSlice } from "@reduxjs/toolkit";

const ItemsInitial = {
  currentItem: {},
  isOpenModal: false,
};

const KPIPlans = createSlice({
  name: "KPIPlans",
  initialState: { ...ItemsInitial },
  reducers: {
    setCurrentItem(state, action) {
      state.currentItem = action?.payload;
    },
    setIsOpenModal(state, action) {
      state.isOpenModal = action?.payload;
    },
  },
});

export const { reducer: KPIPlansReducer, actions } = KPIPlans;
