import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store/store";
import { RegistrantType } from "../../AdminDashboard/Registrant";

const HOST = import.meta.env.VITE_API_URL;

interface UsersState {
  users: RegistrantType[];
  loading: boolean;
  error: null | string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<any[]>(
  "users/fetchAllUsers",
  async () => {
    const token = localStorage.getItem("token-admin");

    const res = await axios.get(`${HOST}/admin/dashboard/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.users;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong.";
      });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
