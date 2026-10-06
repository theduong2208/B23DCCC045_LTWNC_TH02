import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../../features/assignments/assignmentsSlice';
import StatsPage from '../../features/assignments/components/StatsPage';
import { Assignment } from '../../types/assignment';

function renderWithStore(assignments: Assignment[]) {
  const store = configureStore({
    reducer: { assignments: assignmentsReducer },
    preloadedState: {
      assignments: {
        data: assignments,
        status: 'succeeded' as const,
        error: null,
        filter: 'all' as const,
        addStatus: 'idle' as const,
        searchQuery: '',
      },
    },
  });
  return render(
    <Provider store={store}>
      <StatsPage />
    </Provider>
  );
}

describe('Component Tests — StatsPage', () => {
  it('renders stats overview correctly', () => {
    const sample: Assignment[] = [
      {
        id: 's1',
        title: 'Bài 1',
        subject: 'Toán',
        dueDate: '2099-01-01',
        completed: true,
        priority: 'high',
        createdAt: '2026-10-01',
      },
      {
        id: 's2',
        title: 'Bài 2',
        subject: 'Lý',
        dueDate: '2020-01-01',
        completed: false,
        priority: 'low',
        createdAt: '2026-10-01',
      },
    ];

    renderWithStore(sample);

    expect(screen.getByText('📊 Thống kê bài tập')).toBeInTheDocument();
    // Nhãn trong stat-card đã đổi thành "Tổng cộng"
    expect(screen.getByText('Tổng cộng')).toBeInTheDocument();
    expect(screen.getByText('Tỷ lệ hoàn thành')).toBeInTheDocument();
    // "50%" được render thành "50" + "%" trong hai text node riêng — dùng regex
    expect(screen.getByText(/50\s*%/)).toBeInTheDocument();
  });
});
