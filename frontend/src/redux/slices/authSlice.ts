import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: number | null;
  avatarUrl: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userId: typeof window !== "undefined" && localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : null,
  avatarUrl: typeof window !== "undefined" ? localStorage.getItem("avatar") : null,
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
    loginSuccess: (state, action) => {
  console.log("LOGIN PAYLOAD:", action.payload);

  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("userId", String(action.payload.userId));
  localStorage.setItem("avatar", action.payload.avatarUrl);

  state.token = action.payload.token;
  state.userId = action.payload.userId;     
  state.avatarUrl = action.payload.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
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


export const { setCredentials, logout ,loginSuccess } = authSlice.actions;
export default authSlice.reducer;

