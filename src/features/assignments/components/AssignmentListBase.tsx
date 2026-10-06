import { useCallback, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Assignment } from '../../../types/assignment';
import { AssignmentItemContainer } from './AssignmentItem';
import { useAppDispatch } from '../../../app/hooks';
import { addMany } from '../assignmentsSlice';
import { generateSampleAssignments } from '../utils/generateSampleData';
import { usePinStore } from '../../../store/pinStore';

// ------------------------------------------------------------------
// Kích thước cố định của mỗi item trong virtualized list.
// Cần cố định để FixedSizeList tính đúng scroll position.
// Nếu chiều cao không cố định → dùng VariableSizeList (phức tạp hơn).
// ------------------------------------------------------------------
const ITEM_HEIGHT = 140; // px — phải khớp với .a-card chiều cao thực tế

// ------------------------------------------------------------------
// Virtualization (react-window):
// Lý do dùng: với 10.000 items, DOM render tất cả cùng lúc gây
// layout thrashing. react-window chỉ render ~10-15 items trong viewport.
//
// Chỗ KHÔNG dùng: danh sách < 50 items → overhead không đáng
// ------------------------------------------------------------------

const VIRTUALIZE_THRESHOLD = 50; // bật virtualization khi vượt ngưỡng này

export interface AssignmentListBaseProps {
  assignments: Assignment[];
}

export function AssignmentListBase({ assignments }: AssignmentListBaseProps) {
  const dispatch = useAppDispatch();
  const { pinnedIds } = usePinStore();

  // Stress test: tạo 10.000 bài và dispatch một lần duy nhất
  const handleStressTest = useCallback(() => {
    const samples = generateSampleAssignments(10_000);
    dispatch(addMany(samples)); // dispatch 1 lần, không phải 10.000 lần
  }, [dispatch]);

  // useMemo: sắp xếp pinned items lên đầu — tính lại khi assignments hoặc pinnedIds thay đổi
  // Lý do: sort là O(n log n), không muốn chạy lại sau mỗi render không liên quan
  const sortedAssignments = useMemo<Assignment[]>(() => {
    const pinned = assignments.filter((a) => pinnedIds.has(a.id));
    const rest = assignments.filter((a) => !pinnedIds.has(a.id));
    return [...pinned, ...rest];
  }, [assignments, pinnedIds]);

  if (assignments.length === 0) {
    return (
      <>
        <div className="state-panel state-panel--empty">
          <p>Không có bài tập nào ở bộ lọc này.</p>
        </div>
        <StressTestButton onStressTest={handleStressTest} count={assignments.length} />
      </>
    );
  }

  return (
    <div className="a-list-container">
      {/* Nút stress test luôn hiển thị */}
      <StressTestButton onStressTest={handleStressTest} count={sortedAssignments.length} />

      {sortedAssignments.length >= VIRTUALIZE_THRESHOLD ? (
        // Virtualized — dùng khi có nhiều items
        <VirtualList assignments={sortedAssignments} />
      ) : (
        // Non-virtualized — dùng khi ít items (không cần overhead)
        <div className="a-list">
          {sortedAssignments.map((assignment) => (
            <AssignmentItemContainer key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Nút stress test — tách component để dễ đặt ở đầu danh sách
// ------------------------------------------------------------------

interface StressTestButtonProps {
  onStressTest: () => void;
  count: number;
}

function StressTestButton({ onStressTest, count }: StressTestButtonProps) {
  return (
    <div className="stress-test-bar">
      <span className="stress-test-bar__count">
        📊 Tổng: <strong>{count.toLocaleString('vi-VN')}</strong> bài tập
      </span>
      <button
        id="stress-test-btn"
        type="button"
        className="btn btn--outline btn--sm"
        onClick={onStressTest}
        title="Tạo 10.000 bài tập để stress test hiệu năng"
      >
        ⚡ Tạo 10.000 bài tập mẫu
      </button>
    </div>
  );
}

// ------------------------------------------------------------------
// VirtualList — dùng react-window FixedSizeList
//
// Kết hợp với bài ghim: pinnedIds đã được sort ở sortedAssignments
// nên VirtualList chỉ cần render theo thứ tự mảng truyền vào.
// Không cần xử lý đặc biệt bên trong VirtualList.
// ------------------------------------------------------------------

interface VirtualListProps {
  assignments: Assignment[];
}

function VirtualList({ assignments }: VirtualListProps) {
  // Row component — phải memoize để tránh re-render mỗi khi list scroll
  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const assignment = assignments[index];
      if (!assignment) return null;
      return (
        // style cần được apply để react-window tính đúng vị trí absolute
        <div style={style}>
          <AssignmentItemContainer assignment={assignment} />
        </div>
      );
    },
    [assignments]
  );

  return (
    <FixedSizeList
      height={Math.min(assignments.length * ITEM_HEIGHT, window.innerHeight * 0.7)}
      itemCount={assignments.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      overscanCount={3} // render thêm 3 items ngoài viewport để scroll mượt
      className="a-list a-list--virtual"
    >
      {Row}
    </FixedSizeList>
  );
}
