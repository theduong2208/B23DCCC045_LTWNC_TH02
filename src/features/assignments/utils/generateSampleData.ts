import { Assignment, Priority } from '../../../types/assignment';

// ------------------------------------------------------------------
// Dữ liệu mẫu để sinh stress test
// ------------------------------------------------------------------

const SAMPLE_SUBJECTS = [
  'Lập trình Web', 'Cấu trúc dữ liệu', 'Giải tích', 'Vật lý đại cương',
  'Kỹ thuật phần mềm', 'Cơ sở dữ liệu', 'Mạng máy tính', 'Trí tuệ nhân tạo',
  'Tiếng Anh chuyên ngành', 'Toán rời rạc',
];

const SAMPLE_TITLES = [
  'Bài tập chương {n}', 'Đồ án nhóm {n}', 'Bài kiểm tra giữa kỳ {n}',
  'Thuyết trình tuần {n}', 'Lab {n}', 'Quiz {n}', 'Tiểu luận {n}',
  'Bài tập lớn {n}', 'Ôn tập {n}', 'Thực hành {n}',
];

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

/**
 * Sinh ngẫu nhiên mảng Assignment không trùng id.
 * Dùng một lần dispatch addMany thay vì 10.000 lần dispatch.
 *
 * @param count Số lượng bài tập cần tạo
 * @param seed  Giá trị seed để đảm bảo deterministic (tùy chọn)
 */
export function generateSampleAssignments(count: number, seed = Date.now()): Assignment[] {
  const result: Assignment[] = [];
  // LCG đơn giản để giả lập "random" nhưng nhanh hơn Math.random() trong vòng lặp lớn
  let rng = seed;
  const next = (): number => {
    rng = (rng * 1664525 + 1013904223) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const subjectIdx = Math.floor(next() * SAMPLE_SUBJECTS.length);
    const titleIdx = Math.floor(next() * SAMPLE_TITLES.length);
    const priorityIdx = Math.floor(next() * PRIORITIES.length);
    // Hạn nộp: ngẫu nhiên từ -30 đến +60 ngày so với hôm nay
    const daysOffset = Math.floor(next() * 90) - 30;
    const dueDate = new Date(now + daysOffset * 86_400_000);
    const dueDateStr = dueDate.toISOString().split('T')[0]; // YYYY-MM-DD

    result.push({
      id: `gen-${seed}-${i}`,
      subject: SAMPLE_SUBJECTS[subjectIdx],
      title: SAMPLE_TITLES[titleIdx].replace('{n}', String(i + 1)),
      dueDate: dueDateStr,
      priority: PRIORITIES[priorityIdx],
      completed: next() > 0.7, // ~30% hoàn thành
      createdAt: new Date(now - Math.floor(next() * 30 * 86_400_000)).toISOString(),
    });
  }

  return result;
}
