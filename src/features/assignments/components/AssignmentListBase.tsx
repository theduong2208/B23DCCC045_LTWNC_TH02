import { Assignment } from '../../../types/assignment';
import { AssignmentItem } from './AssignmentItem';

export interface AssignmentListBaseProps {
  assignments: Assignment[];
}

export function AssignmentListBase({ assignments }: AssignmentListBaseProps) {
  if (assignments.length === 0) {
    return (
      <div className="state-panel state-panel--empty">
        <p>Không có bài tập nào ở bộ lọc này.</p>
      </div>
    );
  }

  return (
    <div className="a-list">
      {assignments.map((assignment) => (
        <AssignmentItem key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
}
