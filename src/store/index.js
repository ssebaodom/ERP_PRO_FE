import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./reducers/todoSlice";
import loadingReducer from "./reducers/loadingSlice";
import claimsReducer from "./reducers/claimsSlice";

//store
const store = configureStore({
  reducer: {
    todoReducer,
    loadingReducer,
    claimsReducer,
  },
});

export default store;
