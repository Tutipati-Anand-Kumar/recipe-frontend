import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createMealPlan = createAsyncThunk(
  'mealPlan/create',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await api.post('/mealplans', planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const generateGroceryList = createAsyncThunk(
  'mealPlan/generateGrocery',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mealplans/grocery/${planId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const shareMealPlan = createAsyncThunk(
  'mealPlan/share',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mealplans/share/${planId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const initialState = {
  plans: [],
  groceryList: null,
  shareData: null,
  loading: false,
  error: null,
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    clearPlans: (state) => { state.plans = []; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMealPlan.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
      })
      .addCase(createMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(generateGroceryList.fulfilled, (state, action) => {
        state.groceryList = action.payload;
      })
      .addCase(shareMealPlan.fulfilled, (state, action) => {
        state.shareData = action.payload;
      });
  },
});

export const { clearPlans } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;