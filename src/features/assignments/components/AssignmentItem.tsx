import { Assignment } from '../../../types/assignment';
import { AssignmentCard } from './AssignmentCard';
import { useAppDispatch } from '../../../app/hooks';
import { toggleCompleted, removeAssignment } from '../assignmentsSlice';
import { useCountdown } from '../hooks/useCountdown';

interface AssignmentItemProps {
  assignment: Assignment;
}

export function AssignmentItem({ assignment }: AssignmentItemProps) {
  const dispatch = useAppDispatch();
  const { label, isOverdue } = useCountdown(assignment.dueDate, assignment.completed);

  const dueDateLabel = new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const PRIORITY_LABEL: Record<typeof assignment.priority, string> = {
    high: 'Cao',
    medium: 'TB',
    low: 'Thấp',
  };

  return (
    <article
      className={[
        'a-card',
        `a-card--${assignment.priority}`,
        assignment.completed ? 'a-card--done' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Info block */}
      <div className="a-card__info">
        {/* Header row */}
        <header className="a-card__header">
          <span className="a-card__subject">{assignment.subject}</span>
          <span className={`a-card__priority-pill a-card__priority-pill--${assignment.priority}`}>
            {PRIORITY_LABEL[assignment.priority]}
          </span>
        </header>

        {/* Title & due date */}
        <h3 className="a-card__title">{assignment.title}</h3>
        <p className="a-card__due">📅 Hạn nộp: {dueDateLabel}</p>
      </div>

      {/* Actions block */}
      <div className="a-card__actions">
        {/* Countdown badge */}
        <span className={`a-card__countdown ${isOverdue ? 'a-card__countdown--overdue' : ''}`}>
          {label}
        </span>

        <button
          id={`toggle-btn-${assignment.id}`}
          type="button"
          className="btn btn--ghost"
          onClick={() => dispatch(toggleCompleted(assignment.id))}
        >
          {assignment.completed ? '↩ Bỏ đánh dấu' : '✓ Hoàn thành'}
        </button>

        <button
          id={`remove-btn-${assignment.id}`}
          type="button"
          className="btn btn--danger"
          onClick={() => dispatch(removeAssignment(assignment.id))}
          aria-label={`Xoá bài tập ${assignment.title}`}
        >
          🗑
        </button>
      </div>
    </article>
  );
}
