import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../hooks/useDebounce';

describe('Hook Tests — useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should update debounced value after specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    );

    // Change input value
    rerender({ value: 'second', delay: 300 });
    expect(result.current).toBe('first'); // should not update immediately

    // Fast-forward 200ms (less than 300ms)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    // Fast-forward remaining 100ms
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('second');
  });

  it('should reset timer if value changes rapidly before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    // Rapid edits
    rerender({ value: 'ab', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(150);
    });

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(150);
    });

    // Value should still be 'a' because timer reset
    expect(result.current).toBe('a');

    // Fast-forward remaining 150ms for 'abc'
    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('abc');
  });
});
