import store from "../../../../store";
import { retailOrderActions } from "../Slices/RetailOrderSlice";

export const setCurrentRetailOrder = (data) => {
  try {
    store.dispatch(retailOrderActions.setCurrentOrder(data));
  } catch (error) {
    console.log(error);
  }
};

export const setRetailOrderList = (data) => {
  try {
    store.dispatch(retailOrderActions.setListOrder(data));
  } catch (error) {
    console.log(error);
  }
};

export const setRetailOrderScanning = (data) => {
  try {
    store.dispatch(retailOrderActions.setIsScanning(data));
  } catch (error) {
    console.log(error);
  }
};

export const resetRetailOrder = (data) => {
  try {
    store.dispatch(retailOrderActions.reset());
  } catch (error) {
    console.log(error);
  }
};
