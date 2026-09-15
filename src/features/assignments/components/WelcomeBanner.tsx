import { useAppSelector } from '../../../app/hooks';
import { selectAssignments } from '../assignmentsSlice';
import { isOverdue } from '../utils/typeGuards';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

export function WelcomeBanner() {
  const assignments = useAppSelector(selectAssignments);

  const total     = assignments.length;
  const overdueCount  = assignments.filter((a) => isOverdue(a.dueDate, a.completed)).length;
  const doneCount = assignments.filter((a) => a.completed).length;

  const greeting = getGreeting();

  return (
    <>
      {/* Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner__text">
          <p className="welcome-banner__greeting">{greeting} 👋</p>
          <h1 className="welcome-banner__title">
            Xin chào, Sinh Viên!<br />Mừng bạn quay lại.
          </h1>
          <p className="welcome-banner__subtitle">
            Hôm nay bạn có {total - doneCount} bài tập cần hoàn thành.
          </p>
        </div>
        <div className="welcome-banner__emoji" aria-hidden="true">✌️</div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--total">📚</div>
          <div>
            <div className="stat-card__value">{total}</div>
            <div className="stat-card__label">Tổng bài tập</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--overdue">⏰</div>
          <div>
            <div className="stat-card__value" style={{ color: overdueCount > 0 ? 'var(--priority-high)' : 'inherit' }}>
              {overdueCount}
            </div>
            <div className="stat-card__label">Quá hạn</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--done">✅</div>
          <div>
            <div className="stat-card__value" style={{ color: 'var(--priority-low)' }}>{doneCount}</div>
            <div className="stat-card__label">Đã hoàn thành</div>
          </div>
        </div>
      </div>
    </>
  );
}
