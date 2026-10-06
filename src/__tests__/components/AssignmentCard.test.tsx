import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentItem } from '../../features/assignments/components/AssignmentItem';
import { Assignment } from '../../types/assignment';

describe('Component Tests — AssignmentItem', () => {
  const sampleAssignment: Assignment = {
    id: 'card-1',
    title: 'Làm bài thực hành React',
    subject: 'Lập trình Web',
    dueDate: '2099-12-31T23:59:59.000Z',
    completed: false,
    priority: 'high',
    createdAt: '2026-10-01T00:00:00.000Z',
  };

  const defaultProps = {
    assignment: sampleAssignment,
    onToggle: jest.fn(),
    onRemove: jest.fn(),
    onPin: jest.fn(),
    isPinned: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders assignment information correctly', () => {
    render(<AssignmentItem {...defaultProps} />);

    expect(screen.getByText('Làm bài thực hành React')).toBeInTheDocument();
    expect(screen.getByText('Lập trình Web')).toBeInTheDocument();
    expect(screen.getByText('Cao')).toBeInTheDocument();
    expect(screen.getByText('✓ Hoàn thành')).toBeInTheDocument();
  });

  it('calls onToggle when complete button is clicked', async () => {
    const user = userEvent.setup();
    render(<AssignmentItem {...defaultProps} />);

    const toggleBtn = screen.getByText('✓ Hoàn thành');
    await user.click(toggleBtn);

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggle).toHaveBeenCalledWith('card-1');
  });

  it('calls onPin when pin button is clicked', async () => {
    const user = userEvent.setup();
    render(<AssignmentItem {...defaultProps} />);

    const pinBtn = screen.getByRole('button', { name: /Ghim Làm bài thực hành React/i });
    await user.click(pinBtn);

    expect(defaultProps.onPin).toHaveBeenCalledTimes(1);
    expect(defaultProps.onPin).toHaveBeenCalledWith('card-1');
  });

  it('displays pinned badge when isPinned is true', () => {
    render(<AssignmentItem {...defaultProps} isPinned={true} />);

    expect(screen.getByText('📌 Đã ghim')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bỏ ghim Làm bài thực hành React/i })).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<AssignmentItem {...defaultProps} />);

    const removeBtn = screen.getByRole('button', { name: /Xoá bài tập Làm bài thực hành React/i });
    await user.click(removeBtn);

    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
    expect(defaultProps.onRemove).toHaveBeenCalledWith('card-1');
  });
});
