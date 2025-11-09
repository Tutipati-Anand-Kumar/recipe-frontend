import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';
import userReducer from './slices/userSlice';
import mealPlanReducer from './slices/mealPlanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
    user: userReducer,
    mealPlan: mealPlanReducer,
  },
});