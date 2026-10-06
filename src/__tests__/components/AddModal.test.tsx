import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../../features/assignments/assignmentsSlice';
import { AddModal } from '../../features/assignments/components/AddModal';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { assignments: assignmentsReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('Component Tests — AddModal & AssignmentForm', () => {
  it('does not render modal when isOpen is false', () => {
    renderWithStore(<AddModal isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText('📝 Thêm bài tập mới')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    renderWithStore(<AddModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('📝 Thêm bài tập mới')).toBeInTheDocument();
    expect(screen.getByLabelText('Môn học')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên bài tập')).toBeInTheDocument();
  });

  it('displays validation error when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithStore(<AddModal isOpen={true} onClose={jest.fn()} />);

    const submitBtn = screen.getByRole('button', { name: 'Thêm bài tập' });
    await user.click(submitBtn);

    expect(
      screen.getByText('Vui lòng điền đầy đủ môn học, tên bài tập và hạn nộp.')
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    renderWithStore(<AddModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('Đóng');
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
