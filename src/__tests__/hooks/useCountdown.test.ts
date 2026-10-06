import { renderHook } from '@testing-library/react';
import { useCountdown } from '../../features/assignments/hooks/useCountdown';

describe('Hook Tests — useCountdown', () => {
  it('returns "Đã hoàn thành" if completed is true', () => {
    const { result } = renderHook(() => useCountdown('2020-01-01', true));
    expect(result.current.label).toBe('Đã hoàn thành');
    expect(result.current.isOverdue).toBe(false);
  });

  it('returns overdue label for past due date', () => {
    const { result } = renderHook(() => useCountdown('2020-01-01', false));
    expect(result.current.isOverdue).toBe(true);
    expect(result.current.label).toContain('Quá hạn');
  });

  it('returns remaining days for future due date', () => {
    const futureDate = '2099-12-31';
    const { result } = renderHook(() => useCountdown(futureDate, false));
    expect(result.current.isOverdue).toBe(false);
    expect(result.current.label).toContain('Còn');
  });
});
