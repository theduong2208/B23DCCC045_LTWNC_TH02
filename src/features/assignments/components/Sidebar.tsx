export function Sidebar() {
  const navItems = [
    { icon: '🏠', label: 'Trang chủ', active: true },
    { icon: '📋', label: 'Bài tập', active: false },
    { icon: '📅', label: 'Lịch học', active: false },
    { icon: '🔔', label: 'Thông báo', active: false },
    { icon: '📊', label: 'Thống kê', active: false },
  ];

  const bottomItems = [
    { icon: '⚙️', label: 'Cài đặt', active: false },
    { icon: '❓', label: 'Trợ giúp', active: false },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">D</div>
        <div>
          <div className="sidebar__logo-text">DeadlineTracker</div>
          <div className="sidebar__logo-sub">Sinh viên</div>
        </div>
      </div>

      {/* Main nav */}
      <div className="sidebar__section-label">Menu chính</div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`sidebar__link ${item.active ? 'sidebar__link--active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'Bài tập' && (
              <span className="sidebar__link-badge">4</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="sidebar__section-label">Khác</div>
      <nav className="sidebar__nav" style={{ flex: 'none' }}>
        {bottomItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="sidebar__link"
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar">SV</div>
          <div>
            <div className="sidebar__user-name">Sinh Viên</div>
            <div className="sidebar__user-role">K2026 · CNTT</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
