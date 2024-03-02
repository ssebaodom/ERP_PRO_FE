import store from "../../../../store";
import { saleOrderAction } from "../Slice/SaleOrderSlice";

const setSaleOrderLoading = (data) => {
  store.dispatch(saleOrderAction.setLoading(data));
};

const setSaleOrderCurrentStep = (data) => {
  store.dispatch(saleOrderAction.setCurrentStep(data));
};

const setMasterSaleOrderInfo = (data) => {
  store.dispatch(saleOrderAction.setMasterSaleOrderInfo(data));
};

const setDetailSaleOrderInfo = (data) => {
  store.dispatch(saleOrderAction.setDetailSaleOrderInfo(data));
};

const setCurrentSaleOrder = async (data) => {
  store.dispatch(saleOrderAction.setCurrentItemId(data));
};

const setActionSaleOrder = async (data) => {
  store.dispatch(saleOrderAction.setAction(data));
};

export {
  setCurrentSaleOrder,
  setActionSaleOrder,
  setMasterSaleOrderInfo,
  setSaleOrderLoading,
  setSaleOrderCurrentStep,
  setDetailSaleOrderInfo,
};
