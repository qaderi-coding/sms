// ==============================|| USER SLICE ||============================== //

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from 'types/user-profile';

interface UserState {
  detailCards: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  detailCards: [],
  loading: false,
  error: null
};

// Async thunk to fetch user details
export const getDetailCards = createAsyncThunk<UserProfile[]>(
  'user/getDetailCards',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For now, return mock data
      return [
        { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123-456-7890', location: 'New York' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', contact: '098-765-4321', location: 'California' }
      ];
    } catch (error) {
      return rejectWithValue('Failed to fetch user details');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserProfile>) => {
      state.detailCards.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      const index = state.detailCards.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.detailCards[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.detailCards = state.detailCards.filter(user => user.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDetailCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailCards.fulfilled, (state, action) => {
        state.loading = false;
        state.detailCards = action.payload;
      })
      .addCase(getDetailCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;