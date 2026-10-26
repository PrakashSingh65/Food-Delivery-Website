import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import trackingReducer from './slices/trackingSlice';
import { baseApi } from './api/baseApi';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    tracking: trackingReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, socketMiddleware),
});

export default store;
