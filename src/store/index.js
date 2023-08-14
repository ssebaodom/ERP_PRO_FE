import { configureStore } from "@reduxjs/toolkit";
import { DMSCustomersReducer } from "../components/DMS/Store/Reducers/DMSCustomer";
import { taskReducer } from "../components/DMS/Store/Reducers/Task";
import { tourDetailsReducer } from "../components/DMS/Store/Reducers/TourDetail";
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
  },
});

export default store;
