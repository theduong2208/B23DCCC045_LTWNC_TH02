import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Hook dispatch đã được gõ kiểu sẵn theo AppDispatch — dùng thay cho useDispatch thường. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Hook selector đã được gõ kiểu sẵn theo RootState — dùng thay cho useSelector thường. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
