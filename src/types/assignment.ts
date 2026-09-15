// ============================================================
// Domain types — Buổi 1: TypeScript nâng cao
// (union types, utility types: Omit/Pick/Partial, generics)
// ============================================================

export type Priority = 'low' | 'medium' | 'high';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'] as const;

export type StatusFilter = 'all' | 'pending' | 'overdue' | 'completed';

export const STATUS_FILTERS: readonly StatusFilter[] = [
  'all',
  'pending',
  'overdue',
  'completed',
] as const;

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // ISO 8601 string
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

/**
 * Utility type: dữ liệu người dùng nhập khi tạo bài tập mới.
 * Bỏ các trường do hệ thống tự sinh (id, completed, createdAt).
 */
export type NewAssignmentInput = Omit<Assignment, 'id' | 'completed' | 'createdAt'>;

/**
 * Utility type: dữ liệu cho phép cập nhật một phần bài tập.
 */
export type UpdateAssignmentInput = Partial<
  Pick<Assignment, 'subject' | 'title' | 'dueDate' | 'priority'>
>;

/**
 * Utility type: bài tập kèm dữ liệu tính toán (derived) cho UI.
 */
export type AssignmentWithDerived = Assignment & {
  daysRemaining: number;
  isOverdue: boolean;
};

/**
 * Generic wrapper cho response của API giả lập.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Generic async state — có thể tái sử dụng cho bất kỳ slice nào
 * cần lưu trạng thái loading/error của một async thunk.
 */
export interface AsyncState<T> {
  data: T;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
