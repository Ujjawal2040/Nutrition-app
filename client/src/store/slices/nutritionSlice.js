import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

// Search Food
export const searchFood = createAsyncThunk('nutrition/search', async (query, thunkAPI) => {
  try {
    const response = await api.get(`/nutrition/search?q=${query}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Log Food
export const logFood = createAsyncThunk('nutrition/log', async (foodData, thunkAPI) => {
  try {
    const response = await api.post('/nutrition/log', foodData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Get Daily Log
export const getDailyLog = createAsyncThunk('nutrition/getLog', async (date, thunkAPI) => {
  try {
    const response = await api.get(`/nutrition/log?date=${date}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


const initialState = {
  dailyLog: null,
  searchResults: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFood.pending, (state) => { 
        state.isLoading = true; 
        state.searchResults = [];
      })
      .addCase(searchFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data.foods;
      })
      .addCase(getDailyLog.fulfilled, (state, action) => {
        state.dailyLog = action.payload.data.log;
      })
      .addCase(logFood.fulfilled, (state, action) => {
        state.dailyLog = action.payload.data.log;
      });
  },
});

export const { reset } = nutritionSlice.actions;
export default nutritionSlice.reducer;
