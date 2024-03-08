import { createSlice } from "@reduxjs/toolkit";

const saleOrderInitial = {
  isOpenFilter: false,
  loading: false,
  currentStep: 0,
  action: "ADD",
  saleOrderList: { columns: [], dataSource: [], totalRecords: 0 },
  currentItemId: "",
  masterInfo: { ma_kh: null, ten_kh: null, ghi_chu: null },
  detailInfo: { columns: [], data: [] },
  promotionItemsInfo: [],
  paymentInfo: {
    t_tt: 123456,
    httt: null,
    stk: null,
    voucher: null,
    MST: null,
    ma_nt: null,
    han_tt: null,
    nguoi_nhan: null,
    dien_thoai: null,
    dia_chi: null,
    htvc: null,
    dv_vc: null,
    phi_vc: null,
    ngay_nhan: undefined,
  },
  filterInfo: {
    ma_kh: null,
    ten_kh: null,
    dia_chi: null,
    dien_thoai: null,
    so_tu: null,
    so_den: null,
    searchKey: null,
  },
};

const saleOrderSlice = createSlice({
  name: "saleOrderSlice",
  initialState: { ...saleOrderInitial },
  reducers: {
    setLoading(state, action) {
      state.loading = action?.payload;
    },
    setIsOpenFilter(state, action) {
      state.isOpenFilter = action?.payload;
    },
    setCurrentStep(state, action) {
      state.currentStep = action?.payload;
    },
    setAction(state, action) {
      state.action = action?.payload;
    },

    setSaleOrderList(state, action) {
      state.saleOrderList = action?.payload;
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

    setPaymentSaleOrderInfo(state, action) {
      state.paymentInfo = action?.payload;
    },

    resetSaleOrder: () => saleOrderInitial,
  },
});

export const { reducer: saleOrderReducer, actions: saleOrderAction } =
  saleOrderSlice;
