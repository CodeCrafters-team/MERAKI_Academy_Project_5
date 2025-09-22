import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: number | null;
  avatarUrl: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
  avatarUrl: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userId: number; avatarUrl: string }>
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.avatarUrl = action.payload.avatarUrl;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId", String(action.payload.userId));
      localStorage.setItem("avatar", action.payload.avatarUrl);
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.avatarUrl = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("avatar");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;