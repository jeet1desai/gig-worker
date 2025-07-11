import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  role: 'user' | 'provider';
}

const initialState: UserState = {
  role: 'user'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole: (
      state: UserState,
      action: PayloadAction<{ role: 'user' | 'provider' }>
    ) => {
      state.role = action.payload.role;
    }
  }
});

export const { setUserRole } = userSlice.actions;

export default userSlice.reducer;
