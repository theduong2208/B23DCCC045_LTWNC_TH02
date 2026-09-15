import { useEffect, useState, Dispatch, SetStateAction } from 'react';

/**
 * Custom hook generic (Buổi 1 — generic; Buổi 2 — custom hook nâng cao):
 * đồng bộ một state bất kỳ với localStorage, dùng lại được cho nhiều kiểu dữ liệu
 * (ví dụ: bộ lọc đang chọn, tuỳ chọn hiển thị...).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage có thể không khả dụng (chế độ ẩn danh...) — bỏ qua an toàn.
    }
  }, [key, value]);

  return [value, setValue];
}
