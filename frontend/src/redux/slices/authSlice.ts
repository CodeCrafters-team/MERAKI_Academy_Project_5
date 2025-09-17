import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; userId: number; avatarUrl: string }>
    ) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.avatarUrl = action.payload.avatarUrl;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.avatarUrl = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
