import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store/store";

interface UserState {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    formattedBirthday: string;
    role: "student" | "professor" | "personnel";
    year: string;
    course: string;
    section: string;
    school_assigned_number: string;
    password: string;
    show_birthday: 0 | 1;
    show_phone_number: 0 | 1;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    formattedBirthday: "", // e.g., "2000-01-01"
    role: "student" as "student" | "professor" | "personnel",
    year: "",
    course: "",
    section: "",
    school_assigned_number: "",
    password: "",
    show_birthday: 0,
    show_phone_number: 0,
  },
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk<any[]>("user/fetchUser", async () => {
  const token = localStorage.getItem("token-user");

  const res = await axios.get("http://localhost:5000/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.user;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
