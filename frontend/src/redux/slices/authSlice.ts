import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  email: string | null;
  avatarUrl: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  userId: typeof window !== "undefined" && localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null,
  firstName: typeof window !== "undefined" ? localStorage.getItem("firstName") : null,
  lastName: typeof window !== "undefined" ? localStorage.getItem("lastName") : null,
  age: typeof window !== "undefined" && localStorage.getItem("age") ? Number(localStorage.getItem("age")) : null,
  email: typeof window !== "undefined" ? localStorage.getItem("email") : null,
  avatarUrl: typeof window !== "undefined" ? localStorage.getItem("avatar") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    updateProfile: (
      state,
      action: PayloadAction<{
        firstName?: string;
        lastName?: string;
        age?: number;
        email?: string;
        avatarUrl?: string;
      }>
    ) => {
      if (action.payload.firstName) {
        state.firstName = action.payload.firstName;
        localStorage.setItem("firstName", action.payload.firstName);
      }
      if (action.payload.lastName) {
        state.lastName = action.payload.lastName;
        localStorage.setItem("lastName", action.payload.lastName);
      }
      if (action.payload.age !== undefined) {
        state.age = action.payload.age;
        localStorage.setItem("age", String(action.payload.age));
      }
      if (action.payload.email) {
        state.email = action.payload.email;
        localStorage.setItem("email", action.payload.email);
      }
      if (action.payload.avatarUrl) {
        state.avatarUrl = action.payload.avatarUrl;
        localStorage.setItem("avatar", action.payload.avatarUrl);
      }
    },

    loginSuccess: (state, action) => {
    state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.age = action.payload.age;
      state.email = action.payload.email;
      state.avatarUrl = action.payload.avatarUrl ;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userId",action.payload.userId);
      localStorage.setItem("firstName", action.payload.firstName);
      localStorage.setItem("lastName", action.payload.lastName);
      localStorage.setItem("age", String(action.payload.age));
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("avatar", action.payload.avatarUrl)
},


    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.age = null;
      state.email = null;
      state.avatarUrl = null;
      localStorage.clear();
    },

    deleteAccount: (state) => {
      state.token = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.age = null;
      state.email = null;
      state.avatarUrl = null;
      localStorage.clear();
    },
  },
});





export const { logout ,loginSuccess , updateProfile,deleteAccount} = authSlice.actions;
export default authSlice.reducer;


