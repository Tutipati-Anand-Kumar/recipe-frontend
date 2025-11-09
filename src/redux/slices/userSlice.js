import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toggleFavorite } from './recipeSlice'; // ✅ Import added

export const getProfile = createAsyncThunk(
  'user/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateIngredients = createAsyncThunk(
  'user/updateIngredients',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/ingredients', { ingredients });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIngredients.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ingredients: action.payload.ingredients };
      })

      // ✅ NEW: Real-time UI sync for favorites
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (!state.profile) return;
        const recipeId = action.meta.arg; // ID we passed to thunk
        if (!state.profile.favorites) state.profile.favorites = [];

        // Check if it's already in favorites
        const exists = state.profile.favorites.some(
          (fav) => fav.idMeal === recipeId || fav._id === recipeId
        );

        if (exists) {
          // ✅ Remove it
          state.profile.favorites = state.profile.favorites.filter(
            (fav) => fav.idMeal !== recipeId && fav._id !== recipeId
          );
        } else {
          // ✅ Add it (quick visual update)
          state.profile.favorites.push({ idMeal: recipeId });
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
