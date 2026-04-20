import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import nutritionReducer from './slices/nutritionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nutrition: nutritionReducer,
  },
});
