import { configureStore } from '@reduxjs/toolkit';
import serverReducer from './slices/serverSlice';
import queryReducer from './slices/querySlice';

export const store = configureStore({
  reducer: {
    server: serverReducer,
    query: queryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
