import store from "../../../../store";
import { actions as approveItemActions } from "../Slices/ApproveItems";

export const setApproveItemDetail = async (payload) => {
  try {
    store.dispatch(approveItemActions.setDetailData(payload));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
