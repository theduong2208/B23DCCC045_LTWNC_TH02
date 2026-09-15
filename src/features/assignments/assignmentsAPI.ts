import { Assignment, ApiResponse, NewAssignmentInput } from '../../types/assignment';

/**
 * Tạo ngày tương đối so với hôm nay.
 *
 * Lưu dưới dạng YYYY-MM-DD thay vì ISO datetime
 * để tránh lỗi lệch ngày do timezone UTC.
 */
function daysFromNow(days: number): string {
  const d = new Date();

  d.setDate(d.getDate() + days);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

let MOCK_DB: Assignment[] = [
  {
    id: 'a1',
    subject: 'Cấu trúc dữ liệu',
    title: 'Bài tập lớn: Cây AVL',
    dueDate: daysFromNow(2),
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    subject: 'Lập trình Web',
    title: 'Đồ án Student Deadline Tracker',
    dueDate: daysFromNow(5),
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a3',
    subject: 'Xác suất thống kê',
    title: 'Bài tập chương 4',
    dueDate: daysFromNow(-1),
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a4',
    subject: 'Tiếng Anh chuyên ngành',
    title: 'Thuyết trình nhóm',
    dueDate: daysFromNow(-3),
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a5',
    subject: 'Triết học Mác - Lênin',
    title: 'Tiểu luận giữa kỳ',
    dueDate: daysFromNow(-6),
    priority: 'medium',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a6',
    subject: 'Cấu trúc dữ liệu',
    title: 'Quiz tuần 6',
    dueDate: daysFromNow(10),
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Giả lập độ trễ mạng.
 */
function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

/**
 * API giả lập — mô phỏng REST API thật.
 */
export const assignmentsAPI = {
  /**
   * Lấy toàn bộ assignment.
   */
  async fetchAll(): Promise<ApiResponse<Assignment[]>> {
    await delay(null, 600);

    return {
      data: [...MOCK_DB],
      success: true,
    };
  },

  /**
   * Tạo assignment mới.
   */
  async create(
    input: NewAssignmentInput
  ): Promise<ApiResponse<Assignment>> {
    await delay(null, 350);

    const newAssignment: Assignment = {
      ...input,
      id: `a${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    MOCK_DB = [newAssignment, ...MOCK_DB];

    return {
      data: newAssignment,
      success: true,
    };
  },
};