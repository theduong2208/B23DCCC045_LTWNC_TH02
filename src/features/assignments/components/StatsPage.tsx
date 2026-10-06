import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectAssignments } from '../assignmentsSlice';
import { isOverdue } from '../utils/typeGuards';

// ------------------------------------------------------------------
// Hàm tính thống kê — tách riêng để dễ unit test
// ------------------------------------------------------------------

export interface AssignmentStats {
  total: number;
  completed: number;
  overdue: number;
  pending: number;
  completionRate: number; // 0–100
  bySubject: Record<string, { total: number; completed: number }>;
}

export function calcStats(assignments: { dueDate: string; completed: boolean; subject: string }[]): AssignmentStats {
  const total = assignments.length;
  let completed = 0;
  let overdue = 0;
  const bySubject: Record<string, { total: number; completed: number }> = {};

  for (const a of assignments) {
    if (a.completed) completed++;
    else if (isOverdue(a.dueDate, a.completed)) overdue++;

    if (!bySubject[a.subject]) bySubject[a.subject] = { total: 0, completed: 0 };
    bySubject[a.subject].total++;
    if (a.completed) bySubject[a.subject].completed++;
  }

  const pending = total - completed - overdue;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, overdue, pending, completionRate, bySubject };
}

// ------------------------------------------------------------------
// Trang Thống kê — được lazy load bằng React.lazy + Suspense
// Lý do: trang này ít dùng hơn danh sách chính, lazy load giúp giảm
// initial bundle size và cải thiện điểm Lighthouse Performance.
//
// Chỗ KHÔNG dùng lazy: AssignmentList (luôn hiển thị, không nên trễ)
// ------------------------------------------------------------------

export default function StatsPage() {
  const assignments = useAppSelector(selectAssignments);

  // useMemo: tính stats chỉ khi assignments thay đổi
  // Với 10.000 items, calcStats tốn O(n) — cần memoize
  const stats = useMemo(() => calcStats(assignments), [assignments]);

  // Top 5 môn theo số lượng bài
  const topSubjects = useMemo(
    () =>
      Object.entries(stats.bySubject)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5),
    [stats.bySubject]
  );

  return (
    <div className="stats-page">
      <h2 className="stats-page__title">📊 Thống kê bài tập</h2>

      {/* Summary cards */}
      <div className="stats-grid">
        <StatCard emoji="📚" label="Tổng cộng" value={stats.total} color="blue" />
        <StatCard emoji="✅" label="Đã hoàn thành" value={stats.completed} color="green" />
        <StatCard emoji="⏰" label="Quá hạn" value={stats.overdue} color="red" />
        <StatCard emoji="📝" label="Đang chờ" value={stats.pending} color="yellow" />
      </div>

      {/* Completion rate */}
      <div className="stats-section">
        <h3 className="stats-section__title">Tỷ lệ hoàn thành</h3>
        <div className="stats-progress">
          <div
            className="stats-progress__bar"
            style={{ width: `${stats.completionRate}%` }}
            role="progressbar"
            aria-valuenow={stats.completionRate}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <span className="stats-progress__label">{stats.completionRate}%</span>
        </div>
      </div>

      {/* By subject */}
      {topSubjects.length > 0 && (
        <div className="stats-section">
          <h3 className="stats-section__title">Top 5 môn học</h3>
          <div className="stats-subjects">
            {topSubjects.map(([subject, data]) => (
              <div key={subject} className="stats-subject-row">
                <span className="stats-subject-row__name">{subject}</span>
                <span className="stats-subject-row__count">
                  {data.completed}/{data.total} bài
                </span>
                <div className="stats-subject-row__bar-wrap">
                  <div
                    className="stats-subject-row__bar"
                    style={{
                      width: `${data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Stat card con
// ------------------------------------------------------------------

interface StatCardProps {
  emoji: string;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'red' | 'yellow';
}

function StatCard({ emoji, label, value, color }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__emoji">{emoji}</div>
      <div className="stat-card__value">{value.toLocaleString('vi-VN')}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
