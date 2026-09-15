import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Assignment,
  NewAssignmentInput,
  StatusFilter,
  AsyncState,
} from '../../types/assignment';
import { assignmentsAPI } from './assignmentsAPI';
import { isOverdue } from './utils/typeGuards';
import type { RootState } from '../../app/store';

interface AssignmentsState extends AsyncState<Assignment[]> {
  filter: StatusFilter;
  addStatus: 'idle' | 'loading' | 'failed';
}

const initialState: AssignmentsState = {
  data: [],
  status: 'idle',
  error: null,
  filter: 'all',
  addStatus: 'idle',
};

// ------------------------------------------------------------------
// Async thunks (Buổi 3 — createAsyncThunk + TypeScript)
// ------------------------------------------------------------------

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string }
>('assignments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.fetchAll();
    return response.data;
  } catch {
    return rejectWithValue('Không thể tải danh sách bài tập. Vui lòng thử lại.');
  }
});

export const addAssignment = createAsyncThunk<
  Assignment,
  NewAssignmentInput,
  { rejectValue: string }
>('assignments/add', async (input, { rejectWithValue }) => {
  try {
    const response = await assignmentsAPI.create(input);
    return response.data;
  } catch {
    return rejectWithValue('Không thể thêm bài tập mới. Vui lòng thử lại.');
  }
});

// ------------------------------------------------------------------
// Slice
// ------------------------------------------------------------------

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    toggleCompleted(state, action: PayloadAction<string>) {
      const item = state.data.find((a) => a.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    removeAssignment(state, action: PayloadAction<string>) {
      state.data = state.data.filter((a) => a.id !== action.payload);
    },
    setFilter(state, action: PayloadAction<StatusFilter>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đã xảy ra lỗi không xác định.';
      })
      .addCase(addAssignment.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addAssignment.fulfilled, (state, action) => {
        state.addStatus = 'idle';
        state.data.unshift(action.payload);
      })
      .addCase(addAssignment.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.payload ?? 'Không thể thêm bài tập.';
      });
  },
});

export const { toggleCompleted, removeAssignment, setFilter } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;

// ------------------------------------------------------------------
// Selectors
// ------------------------------------------------------------------

export const selectAssignments = (state: RootState): Assignment[] => state.assignments.data;
export const selectFilter = (state: RootState): StatusFilter => state.assignments.filter;
export const selectStatus = (state: RootState) => state.assignments.status;
export const selectError = (state: RootState) => state.assignments.error;
export const selectAddStatus = (state: RootState) => state.assignments.addStatus;

export const selectFilteredAssignments = (state: RootState): Assignment[] => {
  const { data, filter } = state.assignments;
  switch (filter) {
    case 'pending':
      return data.filter((a) => !a.completed && !isOverdue(a.dueDate, a.completed));
    case 'overdue':
      return data.filter((a) => isOverdue(a.dueDate, a.completed));
    case 'completed':
      return data.filter((a) => a.completed);
    default:
      return data;
  }
};
