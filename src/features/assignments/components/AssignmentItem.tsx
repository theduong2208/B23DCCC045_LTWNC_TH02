import { memo, useCallback } from 'react';
import { Assignment } from '../../../types/assignment';
import { useAppDispatch } from '../../../app/hooks';
import { toggleCompleted, removeAssignment } from '../assignmentsSlice';
import { useCountdown } from '../hooks/useCountdown';
import { usePinStore } from '../../../store/pinStore';

// ------------------------------------------------------------------
// AssignmentItem bọc memo:
// • Chỉ re-render khi props (assignment object hoặc handler) thực sự thay đổi.
// • Để memo có tác dụng thật sự, handler phải ổn định (useCallback).
//
// Chỗ KHÔNG dùng memo: AssignmentListVirtual (react-window tự quản lý render)
// ------------------------------------------------------------------

interface AssignmentItemProps {
  assignment: Assignment;
  /** Handler đã được useCallback-ify từ component cha */
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onPin: (id: string) => void;
  isPinned: boolean;
}

const PRIORITY_LABEL: Record<Assignment['priority'], string> = {
  high: 'Cao',
  medium: 'TB',
  low: 'Thấp',
};

export const AssignmentItem = memo(function AssignmentItem({
  assignment,
  onToggle,
  onRemove,
  onPin,
  isPinned,
}: AssignmentItemProps) {
  const { label, isOverdue } = useCountdown(assignment.dueDate, assignment.completed);

  const dueDateLabel = new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <article
      className={[
        'a-card',
        `a-card--${assignment.priority}`,
        assignment.completed ? 'a-card--done' : '',
        isPinned ? 'a-card--pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Info block */}
      <div className="a-card__info">
        <header className="a-card__header">
          <span className="a-card__subject">{assignment.subject}</span>
          <span className={`a-card__priority-pill a-card__priority-pill--${assignment.priority}`}>
            {PRIORITY_LABEL[assignment.priority]}
          </span>
          {isPinned && <span className="a-card__pin-badge">📌 Đã ghim</span>}
        </header>
        <h3 className="a-card__title">{assignment.title}</h3>
        <p className="a-card__due">📅 Hạn nộp: {dueDateLabel}</p>
      </div>

      {/* Actions block */}
      <div className="a-card__actions">
        <span className={`a-card__countdown ${isOverdue ? 'a-card__countdown--overdue' : ''}`}>
          {label}
        </span>

        <button
          id={`pin-btn-${assignment.id}`}
          type="button"
          className={`btn ${isPinned ? 'btn--ghost btn--active' : 'btn--ghost'}`}
          onClick={() => onPin(assignment.id)}
          aria-label={isPinned ? `Bỏ ghim ${assignment.title}` : `Ghim ${assignment.title}`}
          title={isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
        >
          {isPinned ? '📌' : '📍'}
        </button>

        <button
          id={`toggle-btn-${assignment.id}`}
          type="button"
          className="btn btn--ghost"
          onClick={() => onToggle(assignment.id)}
        >
          {assignment.completed ? '↩ Bỏ đánh dấu' : '✓ Hoàn thành'}
        </button>

        <button
          id={`remove-btn-${assignment.id}`}
          type="button"
          className="btn btn--danger"
          onClick={() => onRemove(assignment.id)}
          aria-label={`Xoá bài tập ${assignment.title}`}
        >
          🗑
        </button>
      </div>
    </article>
  );
});

// ------------------------------------------------------------------
// AssignmentItemContainer — kết nối Redux + Zustand, truyền stable handlers.
// Tách riêng để AssignmentItem thuần UI, dễ test và tái sử dụng.
// ------------------------------------------------------------------

interface ContainerProps {
  assignment: Assignment;
}

export function AssignmentItemContainer({ assignment }: ContainerProps) {
  const dispatch = useAppDispatch();
  const { togglePin, isPinned } = usePinStore();

  // useCallback đảm bảo reference ổn định → React.memo của AssignmentItem có tác dụng
  const handleToggle = useCallback(
    (id: string) => dispatch(toggleCompleted(id)),
    [dispatch]
  );
  const handleRemove = useCallback(
    (id: string) => dispatch(removeAssignment(id)),
    [dispatch]
  );
  const handlePin = useCallback(
    (id: string) => togglePin(id),
    [togglePin]
  );

  return (
    <AssignmentItem
      assignment={assignment}
      onToggle={handleToggle}
      onRemove={handleRemove}
      onPin={handlePin}
      isPinned={isPinned(assignment.id)}
    />
  );
}
