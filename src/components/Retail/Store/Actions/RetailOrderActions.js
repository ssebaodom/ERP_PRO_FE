import store from "../../../../store";
import { multipleTablePutApi } from "../../../SaleOrder/API";
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

export const getValueParam = (key) => {
  try {
    const { fetchListParams } = store.getState().retailOrderReducer;
    return fetchListParams[`${key}`];
  } catch (error) {
    console.log(error);
  }
};

export const setFetchListParams = (data) => {
  try {
    const { fetchListParams } = store.getState().retailOrderReducer;

    store.dispatch(
      retailOrderActions.setFetchListParams({ ...fetchListParams, ...data })
    );
  } catch (error) {
    console.log(error);
  }
};

export const resetFetchListParams = async (params) => {
  store.dispatch(retailOrderActions.resetFetchListParams());
};

export const fetchRetailOderList = async (params) => {
  try {
    const result = await multipleTablePutApi({
      store: "api_get_retail_order",
      param: {
        ...params,
      },
      data: {},
    });

    return {
      columns: result?.listObject[1],
      data: result?.listObject[0],
      pagination: result?.listObject[2],
    };
  } catch (error) {
    console.log(error);
  }
};

export const fetchRetailOderDetail = async (params) => {
  try {
    const result = await multipleTablePutApi({
      store: "api_get_retail_order_detail",
      param: {
        ...params,
      },
      data: {},
    });

    const columns = result?.listObject[2].map((item) => {
      return {
        key: item?.Field,
        title: item?.Name,
        dataKey: item?.Field,
        width: item?.width,
        resizable: item?.width ? true : false,
        sortable: false,
        hidden: !item?.width ? true : false,
      };
    });

    return {
      detail: result?.listObject[1],
      master: result?.listObject[0][0],
      columns,
    };
  } catch (error) {
    console.log(error);
  }
};
