interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="app-header">
      {/* Breadcrumb / title */}
      <div className="app-header__title">
        <p className="app-header__breadcrumb">
          Dashboard &rsaquo; <span>Bài tập & Deadline</span>
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
