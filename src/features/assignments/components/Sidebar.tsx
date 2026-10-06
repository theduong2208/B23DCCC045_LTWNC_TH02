// Sidebar nhận activeView và onViewChange để điều hướng giữa list ↔ stats
interface NavItem {
  icon: string;
  label: string;
  view: string | null; // null = không điều hướng
}

interface SidebarProps {
  activeView: string;
  onViewChange: (view: 'list' | 'stats') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems: NavItem[] = [
    { icon: '🏠', label: 'Trang chủ', view: 'list' },
    { icon: '📋', label: 'Bài tập', view: 'list' },
    { icon: '📅', label: 'Lịch học', view: null },
    { icon: '🔔', label: 'Thông báo', view: null },
    { icon: '📊', label: 'Thống kê', view: 'stats' },
  ];

  const bottomItems: NavItem[] = [
    { icon: '⚙️', label: 'Cài đặt', view: null },
    { icon: '❓', label: 'Trợ giúp', view: null },
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
        {navItems.map((item) => {
          const isActive =
            item.view !== null && item.view === activeView;
          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                if (item.view === 'list' || item.view === 'stats') {
                  onViewChange(item.view);
                }
              }}
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Bài tập' && (
                <span className="sidebar__link-badge">4</span>
              )}
            </button>
          );
        })}
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
