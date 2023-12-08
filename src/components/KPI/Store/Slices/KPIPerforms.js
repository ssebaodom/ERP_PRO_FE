import { createSlice } from "@reduxjs/toolkit";

const ItemsInitial = {
  currentItem: {},
  isOpenModal: false,
};

const KPIPerform = createSlice({
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

export const { reducer: KPIPerformReducer, actions } = KPIPerform;
