import { STATUS_FILTERS, StatusFilter } from '../../../types/assignment';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectFilter, setFilter } from '../assignmentsSlice';

const FILTER_LABEL: Record<StatusFilter, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
};

export function FilterBar() {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector(selectFilter);

  return (
    <nav className="filter-bar" aria-label="Lọc theo trạng thái">
      {STATUS_FILTERS.map((filterOption) => (
        <button
          key={filterOption}
          type="button"
          className={`filter-tab ${activeFilter === filterOption ? 'filter-tab--active' : ''}`}
          onClick={() => dispatch(setFilter(filterOption))}
          aria-pressed={activeFilter === filterOption}
        >
          {FILTER_LABEL[filterOption]}
        </button>
      ))}
    </nav>
  );
}
