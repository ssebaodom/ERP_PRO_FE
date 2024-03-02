import { createSlice } from "@reduxjs/toolkit";

const saleOrderInitial = {
  loading: false,
  currentStep: 0,
  action: "",
  currentItemId: "",
  masterInfo: { ma_kh: null, ten_kh: null },
  detailInfo: [],
  promotionItemsInfo: [
    {
      key: "1",
      title: "Ant Design Title 1",
    },
    {
      key: "2",
      title: "Ant Design Title 2",
    },
    {
      key: "3",

      title: "Ant Design Title 3",
    },
    {
      key: "4",
      title: "Ant Design Title 4",
    },
  ],
  paymentInfo: {},
};

const saleOrderSlice = createSlice({
  name: "saleOrderSlice",
  initialState: { ...saleOrderInitial },
  reducers: {
    setLoading(state, action) {
      state.loading = action?.payload;
    },
    setCurrentStep(state, action) {
      state.currentStep = action?.payload;
    },
    setAction(state, action) {
      state.action = action?.payload;
    },

    setCurrentItemId(state, action) {
      state.currentItemId = action?.payload;
    },

    setMasterSaleOrderInfo(state, action) {
      state.masterInfo = action?.payload;
    },

    setDetailSaleOrderInfo(state, action) {
      state.detailInfo = action?.payload;
    },

    setPromotionItemsInfo(state, action) {
      state.promotionItemsInfo = action?.payload;
    },

    setPaymentInfo(state, action) {
      state.paymentInfo = action?.payload;
    },
  },
});

export const { reducer: saleOrderReducer, actions: saleOrderAction } =
  saleOrderSlice;
