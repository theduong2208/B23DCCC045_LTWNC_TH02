import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../../features/assignments/assignmentsSlice';
import { FilterBar } from '../../features/assignments/components/FilterBar';
import { SearchBar } from '../../features/assignments/components/SearchBar';
import { Header } from '../../features/assignments/components/Header';
import { Sidebar } from '../../features/assignments/components/Sidebar';
import { WelcomeBanner } from '../../features/assignments/components/WelcomeBanner';
import { AssignmentListBase } from '../../features/assignments/components/AssignmentListBase';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Assignment } from '../../types/assignment';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { assignments: assignmentsReducer },
  });
  return render(
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>
  );
}

describe('Component Tests — UI Components', () => {
  it('renders FilterBar and handles filter change', async () => {
    const user = userEvent.setup();
    renderWithStore(<FilterBar />);

    expect(screen.getByText('Tất cả')).toBeInTheDocument();
    const overdueBtn = screen.getByText('Quá hạn');
    await user.click(overdueBtn);
    expect(overdueBtn.className).toContain('filter-tab--active');
  });

  it('renders SearchBar and updates input value', async () => {
    const user = userEvent.setup();
    renderWithStore(<SearchBar />);

    const input = screen.getByPlaceholderText('Tìm bài tập, môn học...');
    await user.type(input, 'Toán');
    expect(input).toHaveValue('Toán');
  });

  it('renders Header and calls onAddClick', async () => {
    const user = userEvent.setup();
    const handleAdd = jest.fn();
    renderWithStore(<Header onAddClick={handleAdd} />);

    expect(screen.getByText('Bài tập & Deadline')).toBeInTheDocument();
    const addBtn = screen.getByText('＋ Thêm bài tập');
    await user.click(addBtn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('renders Sidebar and handles view navigation', async () => {
    const user = userEvent.setup();
    const handleViewChange = jest.fn();
    renderWithStore(<Sidebar activeView="list" onViewChange={handleViewChange} />);

    const statsBtn = screen.getByText('Thống kê');
    await user.click(statsBtn);
    expect(handleViewChange).toHaveBeenCalledWith('stats');
  });

  it('renders WelcomeBanner with current stats summary', () => {
    renderWithStore(<WelcomeBanner />);
    expect(screen.getByText(/Xin chào, Sinh Viên!/i)).toBeInTheDocument();
  });

  it('renders AssignmentListBase with empty state and stress test button', async () => {
    const user = userEvent.setup();
    renderWithStore(<AssignmentListBase assignments={[]} />);

    expect(screen.getByText('Không có bài tập nào ở bộ lọc này.')).toBeInTheDocument();
    const stressBtn = screen.getByText('⚡ Tạo 10.000 bài tập mẫu');
    await user.click(stressBtn);
  });

  it('renders AssignmentListBase with list items under threshold', () => {
    const sample: Assignment[] = [
      {
        id: 'list-1',
        title: 'Bài tập 1',
        subject: 'Toán',
        dueDate: '2026-10-10',
        completed: false,
        priority: 'high',
        createdAt: '2026-10-01',
      },
    ];
    renderWithStore(<AssignmentListBase assignments={sample} />);
    expect(screen.getByText('Bài tập 1')).toBeInTheDocument();
  });
});
