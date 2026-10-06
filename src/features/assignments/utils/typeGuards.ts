import { Assignment, PRIORITIES, Priority } from '../../../types/assignment';

/** Type guard: kiểm tra một giá trị bất kỳ có phải là Priority hợp lệ. */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);
}

/** Type guard: kiểm tra dữ liệu thô (vd. từ API/localStorage) có đúng shape Assignment. */
export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.subject === 'string' &&
    typeof v.title === 'string' &&
    typeof v.dueDate === 'string' &&
    isPriority(v.priority) &&
    typeof v.completed === 'boolean' &&
    typeof v.createdAt === 'string'
  );
}

/** Type guard dạng generic: lọc mảng unknown[] thành mảng Assignment[] an toàn. */
export function filterValidAssignments(items: unknown[]): Assignment[] {
  return items.filter(isAssignment);
}

/**
 * Hàm thuần (không phải type guard nhưng cùng module chức năng):
 * xác định một bài tập có đang quá hạn hay không.
 */
export function isOverdue(dueDate: string, completed: boolean): boolean {
  if (completed) return false;
  return new Date(dueDate).getTime() < Date.now();
}

/** Tính số ngày còn lại đến hạn. Trả về số âm nếu quá hạn. */
export function calcDaysLeft(dueDate: string, nowMs = Date.now()): number {
  const diffTime = new Date(dueDate).getTime() - nowMs;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/** Generic helper — nhóm phần tử theo khoá bất kỳ, tái sử dụng cho nhiều loại dữ liệu. */
export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
