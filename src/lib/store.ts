import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import productsReducer from './features/products/productsSlice';
import categoriesReducer from './features/categories/categoriesSlice'; // Import the new reducer

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      categories: categoriesReducer, // Add the new reducer here
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];