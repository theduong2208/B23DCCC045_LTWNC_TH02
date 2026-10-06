import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setSearchQuery } from '../assignmentsSlice';
import { useDebounce } from '../../../hooks/useDebounce';

// ------------------------------------------------------------------
// SearchBar — ô tìm kiếm với useDebounce 300ms + dispatch setSearchQuery.
//
// Lý do dùng useDebounce:
// Khi có 10.000 items, mỗi lần gõ phím chạy lại selector filter
// là rất tốn kém. Debounce 300ms chỉ dispatch sau khi người dùng
// ngừng gõ, tránh re-render liên tục.
//
// Chỗ KHÔNG dùng debounce: FilterBar (click button, không gõ liên tục)
// ------------------------------------------------------------------

export const SearchBar = React.memo(function SearchBar() {
  const dispatch = useAppDispatch();
  // State local để input phản hồi ngay (không giật)
  const [inputValue, setInputValue] = useState('');

  // Debounce 300ms — chỉ dispatch sau khi người dùng ngừng gõ
  const debouncedValue = useDebounce(inputValue, 300);

  // Dispatch lên Redux mỗi khi debouncedValue thay đổi
  useEffect(() => {
    dispatch(setSearchQuery(debouncedValue));
  }, [dispatch, debouncedValue]);

  // useCallback: reference ổn định để React.memo hoạt động
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
  }, []);

  return (
    <div className="search-bar" role="search">
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      <input
        id="search-input"
        type="search"
        className="search-bar__input"
        placeholder="Tìm bài tập, môn học..."
        value={inputValue}
        onChange={handleChange}
        aria-label="Tìm kiếm bài tập"
      />
      {inputValue && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
});
