import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { severity_type } from "../../../shared/components/SnackbarAuto";

interface SnackbarState {
  isSnackbar: boolean;
  message: string;
  severity: severity_type;
}

const initialState: SnackbarState = {
  isSnackbar: false,
  message: "",
  severity: "info",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    snackbarOpened(state, action: PayloadAction<SnackbarState>) {
      state.isSnackbar = action.payload.isSnackbar;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    snackbarClosed(state) {
      state.isSnackbar = false;
      state.message = "";
      state.severity = "info";
    },
  },
});

export const selectSnackbar = (state: RootState) => state.snackbar;

export const { snackbarOpened, snackbarClosed } = snackbarSlice.actions;
export default snackbarSlice.reducer;
