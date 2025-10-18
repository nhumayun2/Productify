import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

// Define the shape of a single category
interface Category {
  id: string;
  name: string;
  image: string;
}

// Define the shape of the categories state
interface CategoriesState {
  items: Category[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Set the initial state
const initialState: CategoriesState = {
  items: [],
  loading: 'idle',
  error: null,
};

// Create an async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await fetch('https://api.bitechx.com/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch categories');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Create the categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;