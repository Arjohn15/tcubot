import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../user/redux/userSlice";
import usersReducer from "../admin/shared/redux/usersSlice";
import snackbarReducer from "./shared/snackbarSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    snackbar: snackbarReducer,
  },
});

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
