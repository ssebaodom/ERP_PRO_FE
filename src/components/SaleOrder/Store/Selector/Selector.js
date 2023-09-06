export const getCurrentSaleOutDetail = (state) => {
  return state.saleoutDetailsReducer.currentDetailItem;
};

export const getCurrentSaleOutMaster = (state) => {
  return state.saleoutDetailsReducer.currentMasterItem;
};

export const getFinalDetail = (state) => {
  return state.saleoutDetailsReducer.finalDetails;
};
