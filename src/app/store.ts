/// <reference types="vite/client" />
import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import { createLogger } from 'redux-logger';

// ------------------------------------------------------------------
// Cấu hình Store
// redux-logger chỉ thêm vào middleware khi DEV.
// Vite tree-shakes nó ra khỏi production bundle.
// ------------------------------------------------------------------

const devMiddleware = import.meta.env.DEV
  ? [
      createLogger({
        collapsed: true,  // thu gọn group log
        duration: true,   // hiện thời gian thực thi mỗi action
        timestamp: false, // bỏ timestamp cho gọn
      }),
    ]
  : [];

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...devMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
