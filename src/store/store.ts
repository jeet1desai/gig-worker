import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { useDispatch as useAppDispatch, useSelector as useAppSelector, type TypedUseSelectorHook } from 'react-redux';

import userReducer from './slices/user';
import adminUserReducer from './slices/admin-user';

const rootReducer = combineReducers({
  user: userReducer,
  adminUser: adminUserReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
