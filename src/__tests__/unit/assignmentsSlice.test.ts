import assignmentsReducer, {
  toggleCompleted,
  removeAssignment,
  setFilter,
  setSearchQuery,
  addMany,
  fetchAssignments,
} from '../../features/assignments/assignmentsSlice';
import { Assignment } from '../../types/assignment';

describe('Unit Tests — assignmentsSlice Reducer', () => {
  const initialState = {
    data: [],
    status: 'idle' as const,
    error: null,
    filter: 'all' as const,
    addStatus: 'idle' as const,
    searchQuery: '',
  };

  const sampleAssignment: Assignment = {
    id: 'test-1',
    title: 'Học TypeScript',
    subject: 'Lập trình',
    dueDate: '2026-10-10T00:00:00.000Z',
    completed: false,
    priority: 'high',
    createdAt: '2026-10-01T00:00:00.000Z',
  };

  it('should return initial state when passed undefined', () => {
    expect(assignmentsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleCompleted for existing assignment', () => {
    const stateWithItem = { ...initialState, data: [sampleAssignment] };
    const nextState = assignmentsReducer(stateWithItem, toggleCompleted('test-1'));
    expect(nextState.data[0].completed).toBe(true);

    const toggledBack = assignmentsReducer(nextState, toggleCompleted('test-1'));
    expect(toggledBack.data[0].completed).toBe(false);
  });

  it('should ignore toggleCompleted for non-existent id', () => {
    const stateWithItem = { ...initialState, data: [sampleAssignment] };
    const nextState = assignmentsReducer(stateWithItem, toggleCompleted('non-existent-id'));
    expect(nextState.data).toEqual([sampleAssignment]);
  });

  it('should handle removeAssignment', () => {
    const stateWithItem = { ...initialState, data: [sampleAssignment] };
    const nextState = assignmentsReducer(stateWithItem, removeAssignment('test-1'));
    expect(nextState.data).toHaveLength(0);
  });

  it('should handle addMany', () => {
    const extraItems: Assignment[] = [
      sampleAssignment,
      { ...sampleAssignment, id: 'test-2', title: 'Bài tập 2' },
    ];
    const nextState = assignmentsReducer(initialState, addMany(extraItems));
    expect(nextState.data).toHaveLength(2);
  });

  it('should handle setFilter', () => {
    const nextState = assignmentsReducer(initialState, setFilter('completed'));
    expect(nextState.filter).toBe('completed');
  });

  it('should handle setSearchQuery', () => {
    const nextState = assignmentsReducer(initialState, setSearchQuery('TypeScript'));
    expect(nextState.searchQuery).toBe('TypeScript');
  });

  it('should handle fetchAssignments.pending and fetchAssignments.fulfilled', () => {
    const pendingState = assignmentsReducer(initialState, fetchAssignments.pending('', undefined));
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    const fulfilledState = assignmentsReducer(
      pendingState,
      fetchAssignments.fulfilled([sampleAssignment], '', undefined)
    );
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.data).toEqual([sampleAssignment]);
  });
});
