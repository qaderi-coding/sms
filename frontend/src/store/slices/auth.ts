// third-party
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { AuthState, User } from 'types/auth';

// initial state
const initialState: AuthState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  token: null
};

interface LoginPayload {
  user: User;
  token: string;
}

interface InitializePayload {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

// ==============================|| SLICE - AUTH ||============================== //

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.user = null;
      state.token = null;
    },
    initialize(state, action: PayloadAction<InitializePayload>) {
      state.isInitialized = true;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  }
});

export default authSlice.reducer;
export const { login, logout, initialize } = authSlice.actions;