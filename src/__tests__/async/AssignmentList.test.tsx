import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../../features/assignments/assignmentsSlice';
import { AssignmentList } from '../../features/assignments/components/AssignmentList';
import { Assignment } from '../../types/assignment';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { assignments: assignmentsReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('Async Tests — AssignmentList & withLoading HOC', () => {
  const sampleAssignments: Assignment[] = [
    {
      id: 'async-1',
      title: 'Bài tập Async Test',
      subject: 'Lập trình mạng',
      dueDate: '2026-12-31T00:00:00.000Z',
      completed: false,
      priority: 'high',
      createdAt: '2026-10-01T00:00:00.000Z',
    },
  ];

  it('1. Loading state: displays loading spinner and text', () => {
    renderWithStore(
      <AssignmentList isLoading={true} error={null} assignments={[]} />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Đang tải danh sách bài tập...')).toBeInTheDocument();
  });

  it('2. Error state: displays error message when fetch fails', () => {
    renderWithStore(
      <AssignmentList
        isLoading={false}
        error="Không thể kết nối máy chủ"
        assignments={[]}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText('Không tải được dữ liệu: Không thể kết nối máy chủ')
    ).toBeInTheDocument();
  });

  it('3. Success state: renders list items when data loading succeeds', () => {
    renderWithStore(
      <AssignmentList
        isLoading={false}
        error={null}
        assignments={sampleAssignments}
      />
    );

    expect(screen.getByText('Bài tập Async Test')).toBeInTheDocument();
    expect(screen.getByText('Lập trình mạng')).toBeInTheDocument();
  });
});
