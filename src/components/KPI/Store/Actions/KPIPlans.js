import store from "../../../../store";
import { actions } from "../Slices/KPIPlans";

export const setIsOpenModal = async (payload) => {
  try {
    store.dispatch(actions.setIsOpenModal(payload));
  } catch (error) {
    console.error(error);
  }
};

export const setCurrentItem = async (payload) => {
  try {
    store.dispatch(actions.setCurrentItem(payload));
  } catch (error) {
    console.error(error);
  }
};
