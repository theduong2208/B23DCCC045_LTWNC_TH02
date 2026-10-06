import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// ------------------------------------------------------------------
// ThemeContext — chủ đề sáng/tối.
//
// Thiết kế tối ưu:
// • value được bọc bởi useMemo → chỉ re-render consumer khi theme thực sự thay đổi.
// • toggleTheme bọc bởi useCallback → reference ổn định, không gây re-render con.
// • Context này hoàn toàn độc lập, không kết hợp với bất kỳ Context nào khác.
// ------------------------------------------------------------------

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Đọc preference từ localStorage hoặc system prefers-color-scheme
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  /* useCallback: reference toggleTheme không đổi giữa các lần render */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  /* useMemo: object value chỉ tạo lại khi theme hoặc toggleTheme thay đổi */
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {/* Gắn data-theme lên <html> để CSS variables hoạt động */}
      <div data-theme={theme} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Hook tiện ích — ném lỗi rõ ràng nếu dùng ngoài ThemeProvider */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme phải được gọi bên trong <ThemeProvider>.');
  }
  return ctx;
}
