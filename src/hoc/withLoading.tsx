import React from 'react';

export interface WithLoadingProps {
  isLoading: boolean;
  error?: string | null;
}

/**
 * Higher-Order Component (Buổi 2): bọc một component bất kỳ để tự động
 * xử lý hiển thị trạng thái "đang tải" / "lỗi" trước khi render nội dung thật.
 * Dùng generic <P> để giữ nguyên kiểu props của component gốc.
 */
export function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return function WithLoading({ isLoading, error, ...rest }) {
    if (isLoading) {
      return (
        <div className="state-panel state-panel--loading" role="status">
          <div className="spinner" aria-hidden="true" />
          <p>Đang tải danh sách bài tập...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="state-panel state-panel--error" role="alert">
          <p>Không tải được dữ liệu: {error}</p>
        </div>
      );
    }

    return <Component {...(rest as P)} />;
  };
}
