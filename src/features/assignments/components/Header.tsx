import { useTheme } from '../../../contexts/ThemeContext';

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      {/* Breadcrumb / title */}
      <div className="app-header__title">
        <p className="app-header__breadcrumb">
          Dashboard &rsaquo; <span>Bài tập &amp; Deadline</span>
        </p>
      </div>

      {/* Actions */}
      <div className="app-header__actions">
        {/* Search icon */}
        <button
          id="header-search-btn"
          type="button"
          className="app-header__icon-btn"
          aria-label="Tìm kiếm"
          title="Tìm kiếm"
        >
          🔍
        </button>

        {/* Notifications */}
        <button
          id="header-notif-btn"
          type="button"
          className="app-header__icon-btn"
          aria-label="Thông báo"
          title="Thông báo"
        >
          🔔
          <span className="app-header__notif-dot" />
        </button>

        {/* Nút đổi theme — chỉ gọi toggleTheme, không cần prop từ App */}
        <button
          id="header-theme-btn"
          type="button"
          className="app-header__icon-btn"
          aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Add button */}
        <button
          id="header-add-btn"
          type="button"
          className="btn btn--primary"
          onClick={onAddClick}
        >
          ＋ Thêm bài tập
        </button>

        {/* Avatar */}
        <div
          className="app-header__avatar"
          role="button"
          tabIndex={0}
          aria-label="Tài khoản"
          title="Tài khoản của bạn"
        >
          SV
        </div>
      </div>
    </header>
  );
}
