import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { Product, ProductSubmitData } from '@/types';

// Define the payload for the updateProduct thunk
interface UpdateProductPayload {
  id: string;
  data: Partial<ProductSubmitData>;
}

// Define the payload for the fetchProducts thunk for pagination
interface FetchProductsPayload {
  page: number;
  limit?: number;
}

// --- NEW: Define the payload for fetching by category ---
interface FetchProductsByCategoryPayload {
  categoryId: string;
  page: number;
  limit?: number;
}


// Define the shape of the products state with pagination fields
interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: 'idle',
  error: null,
  currentPage: 1,
  hasNextPage: true,
};

// A helper function to handle API errors gracefully
const handleApiError = async (response: Response, defaultMessage: string) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const errorData = await response.json();
    return errorData.message || defaultMessage;
  } else {
    // If not JSON, return the plain text response
    return await response.text();
  }
};


// --- Thunk Definitions with updated error handling ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit = 12 }: FetchProductsPayload, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(`https://api.bitechx.com/products?offset=${offset}&limit=${limit}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to fetch products'));
      const data = await response.json();
      const hasNext = data.length === limit;
      return { products: data, hasNextPage: hasNext, page };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// --- NEW: Thunk for fetching products by category ---
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, page, limit = 12 }: FetchProductsByCategoryPayload, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    const offset = (page - 1) * limit;
    try {
      const response = await fetch(`https://api.bitechx.com/products?offset=${offset}&limit=${limit}&categoryId=${categoryId}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to fetch products by category'));
      const data = await response.json();
      const hasNext = data.length === limit;
      return { products: data, hasNextPage: hasNext, page };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch(`https://api.bitechx.com/products/${slug}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to fetch product'));
      return await response.json();
    } catch (error) {
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch(`https://api.bitechx.com/products/${productId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to delete product'));
      return productId;
    } catch (error) {
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchText: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch(`https://api.bitechx.com/products/search?searchedText=${searchText}`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Search failed'));
      return await response.json();
    } catch (error) {
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductSubmitData, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch('https://api.bitechx.com/products', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to create product'));
      return await response.json();
    } catch (error) {
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: UpdateProductPayload, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue('No authentication token found');
    try {
      const response = await fetch(`https://api.bitechx.com/products/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!response.ok) return rejectWithValue(await handleApiError(response, 'Failed to update product'));
      return await response.json();
    } catch (error) {
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload.products) ? action.payload.products : [];
        state.hasNextPage = action.payload.hasNextPage;
        state.currentPage = action.payload.page;
        state.loading = 'succeeded';
      })
      // --- NEW: Case for fetching products by category ---
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload.products) ? action.payload.products : [];
        state.hasNextPage = action.payload.hasNextPage;
        state.currentPage = action.payload.page;
        state.loading = 'succeeded';
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { 
        state.selectedProduct = action.payload; 
        state.loading = 'succeeded';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => { 
        state.items = state.items.filter(item => item.id !== action.payload); 
        state.selectedProduct = null;
        state.loading = 'succeeded';
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => { 
          state.items = Array.isArray(action.payload) ? action.payload : [];
          state.hasNextPage = false;
          state.currentPage = 1;
          state.loading = 'succeeded';
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => { 
        state.items.unshift(action.payload);
        state.loading = 'succeeded';
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) { state.items[index] = action.payload; }
        state.selectedProduct = action.payload;
        state.loading = 'succeeded';
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = 'pending';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;

