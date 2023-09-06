import { configureStore } from "@reduxjs/toolkit";
import { DMSCustomersReducer } from "../components/DMS/Store/Reducers/DMSCustomer";
import { taskReducer } from "../components/DMS/Store/Reducers/Task";
import { tourDetailsReducer } from "../components/DMS/Store/Reducers/TourDetail";
import { approveItemsReducer } from "../components/Items/Store/Slices/ApproveItems";
import { saleoutDetailsReducer } from "../components/SaleOrder/Store/Slice/SaleOutSlice";
import claimsReducer from "./reducers/claimsSlice";
import loadingReducer from "./reducers/loadingSlice";
import todoReducer from "./reducers/todoSlice";

//store
const store = configureStore({
  reducer: {
    todoReducer,
    loadingReducer,
    claimsReducer,
    DMSCustomersReducer,
    tourDetailsReducer,
    taskReducer,
    saleoutDetailsReducer,
    approveItemsReducer,
  },
});

export default store;
