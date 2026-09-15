import { useEffect, useState } from 'react';

export interface CountdownResult {
  daysRemaining: number;
  isOverdue: boolean;
  /** Nhãn hiển thị sẵn: "Còn X ngày" / "Quá hạn Y ngày" / "Hạn hôm nay" / "Đã hoàn thành" */
  label: string;
}

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Custom hook nâng cao (Buổi 2): tính và tự cập nhật số ngày còn lại
 * đến hạn nộp của một bài tập, làm mới định kỳ mà không cần reload trang.
 *
 * @param dueDate    Hạn nộp dạng chuỗi ISO
 * @param completed  Bài tập đã hoàn thành hay chưa
 * @param refreshMs  Chu kỳ làm mới đồng hồ đếm ngược (mặc định 1 phút)
 */
export function useCountdown(
  dueDate: string,
  completed: boolean,
  refreshMs = 60_000
): CountdownResult {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), refreshMs);
    return () => window.clearInterval(timer);
  }, [refreshMs]);

  const dueTime = new Date(dueDate).getTime();
  const diffDays = Math.ceil((dueTime - now) / ONE_DAY_MS);

  if (completed) {
    return { daysRemaining: diffDays, isOverdue: false, label: 'Đã hoàn thành' };
  }
  if (diffDays < 0) {
    return {
      daysRemaining: diffDays,
      isOverdue: true,
      label: `Quá hạn ${Math.abs(diffDays)} ngày`,
    };
  }
  if (diffDays === 0) {
    return { daysRemaining: 0, isOverdue: false, label: 'Hạn hôm nay' };
  }
  return { daysRemaining: diffDays, isOverdue: false, label: `Còn ${diffDays} ngày` };
}
