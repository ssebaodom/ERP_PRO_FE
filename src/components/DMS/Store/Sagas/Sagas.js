import store from "../../../../store";
import { SoFuckingUltimateGetApi, UltimatePutDataApi } from "../../API";
import { actions as DMSCustomer } from "../Reducers/DMSCustomer";
import { actions as imagesList } from "../Reducers/ImagesList";
import { actions as taskActions } from "../Reducers/Task";
import { actions as tourDetail } from "../Reducers/TourDetail";

export const fetchDMSCustomers = async (payload) => {
  try {
    await SoFuckingUltimateGetApi(payload).then((res) => {
      store.dispatch(DMSCustomer.setDMSCustomers(res.data));
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const fetchDMSCustomersDetail = async (payload) => {
  try {
    const params = {
      store: "get_vcrdm_detail",
      data: {
        ma_kh: payload,
        userid: 0,
      },
    };

    await SoFuckingUltimateGetApi(params).then(async (res) => {
      await store.dispatch(DMSCustomer.setCurrentDMSCustomer(res.data[0]));
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const setCurrentTab = async (payload) => {
  try {
    store.dispatch(DMSCustomer.setActiveTab(payload));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const setTourDetail = async (payload) => {
  try {
    store.dispatch(tourDetail.setDetailData(payload));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const setTaskDetail = async (payload) => {
  try {
    store.dispatch(taskActions.setDetailData(payload));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createUltimate = async (payload) => {
  try {
    var status;
    await UltimatePutDataApi({
      store: payload.store,
      data: payload.data,
      listData: payload.listData,
    }).then((res) => {
      if (res?.status !== "200") {
        status = 500;
      }
      status = 200;
    });

    return status;
  } catch (error) {
    return error;
  }
};

export const setCurrentImageIndex = async (payload) => {
  try {
    store.dispatch(imagesList.setCurrentImageIndex(payload));
  } catch (error) {
    console.error(error);
  }
};

export const setCurrentImagesList = async (payload) => {
  try {
    store.dispatch(imagesList.setCurrentImagesList(payload));
  } catch (error) {
    console.error(error);
  }
};
