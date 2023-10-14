import { configureStore } from "@reduxjs/toolkit";
import { DMSCustomersReducer } from "../components/DMS/Store/Reducers/DMSCustomer";
import { imagesListReducer } from "../components/DMS/Store/Reducers/ImagesList";
import { taskReducer } from "../components/DMS/Store/Reducers/Task";
import { tourDetailsReducer } from "../components/DMS/Store/Reducers/TourDetail";
import { approveItemsReducer } from "../components/Items/Store/Slices/ApproveItems";
import { saleoutDetailsReducer } from "../components/SaleOrder/Store/Slice/SaleOutSlice";
import { AccountsReducer } from "../components/SystemOptions/Store/Reducers/Reducers";
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
    AccountsReducer,
    imagesListReducer,
  },
});

export default store;
