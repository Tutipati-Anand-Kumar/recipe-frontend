import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const searchRecipes = createAsyncThunk(
  'recipe/search',
  async ({ query, type = 'name' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes/search', { params: { query, type } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getRecipe = createAsyncThunk(
  'recipe/get',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getSuggestions = createAsyncThunk(
  'recipe/suggestions',
  async (maxTime = 60, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes/suggestions', { params: { maxTime } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'recipe/toggleFavorite',
  async (recipeId, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes/favorite', { recipeId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const initialState = {
  recipes: [],
  currentRecipe: null,
  suggestions: [],
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearRecipes: (state) => { state.recipes = []; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getRecipe.fulfilled, (state, action) => {
        state.currentRecipe = action.payload;
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        // Optimistic update: Toggle in local state if needed
      });
  },
});

export const { clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;