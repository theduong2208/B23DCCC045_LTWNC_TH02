import { useEffect, useState } from 'react';

/**
 * Trì hoãn cập nhật giá trị sau một khoảng thời gian im lặng.
 * Dùng cho ô tìm kiếm để tránh tính toán filter sau mỗi lần gõ phím.
 *
 * @param value      Giá trị cần debounce
 * @param delayMs    Thời gian chờ (ms), mặc định 300ms
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Hủy timer cũ mỗi khi value hoặc delay thay đổi
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
