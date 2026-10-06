import assignmentsReducer, {
  toggleCompleted,
  removeAssignment,
  setFilter,
  setSearchQuery,
  addMany,
  fetchAssignments,
  addAssignment,
  selectFilteredAssignments,
} from "../../features/assignments/assignmentsSlice";
import { Assignment } from "../../types/assignment";
import type { RootState } from "../../app/store";

describe("Unit Tests - assignmentsSlice Reducer", () => {
  const initialState = {
    data: [],
    status: "idle" as const,
    error: null,
    filter: "all" as const,
    addStatus: "idle" as const,
    searchQuery: "",
  };

  const pendingAssignment: Assignment = {
    id: "test-1",
    title: "Hoc TypeScript",
    subject: "Lap trinh",
    dueDate: "2099-12-31",
    completed: false,
    priority: "high",
    createdAt: "2026-10-01",
  };

  const overdueAssignment: Assignment = {
    id: "test-2",
    title: "Bai qua han",
    subject: "Toan",
    dueDate: "2020-01-01",
    completed: false,
    priority: "medium",
    createdAt: "2020-01-01",
  };

  const completedAssignment: Assignment = {
    id: "test-3",
    title: "Bai da xong",
    subject: "Ly",
    dueDate: "2026-01-01",
    completed: true,
    priority: "low",
    createdAt: "2026-01-01",
  };

  it("should return initial state when passed undefined", () => {
    expect(assignmentsReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle toggleCompleted for existing assignment", () => {
    const stateWithItem = { ...initialState, data: [pendingAssignment] };
    const nextState = assignmentsReducer(stateWithItem, toggleCompleted("test-1"));
    expect(nextState.data[0].completed).toBe(true);
    const toggledBack = assignmentsReducer(nextState, toggleCompleted("test-1"));
    expect(toggledBack.data[0].completed).toBe(false);
  });

  it("should ignore toggleCompleted for non-existent id", () => {
    const stateWithItem = { ...initialState, data: [pendingAssignment] };
    const nextState = assignmentsReducer(stateWithItem, toggleCompleted("non-existent-id"));
    expect(nextState.data).toEqual([pendingAssignment]);
  });

  it("should handle removeAssignment", () => {
    const stateWithItem = { ...initialState, data: [pendingAssignment] };
    const nextState = assignmentsReducer(stateWithItem, removeAssignment("test-1"));
    expect(nextState.data).toHaveLength(0);
  });

  it("should handle removeAssignment voi id khong ton tai", () => {
    const stateWithItem = { ...initialState, data: [pendingAssignment] };
    const nextState = assignmentsReducer(stateWithItem, removeAssignment("x-99"));
    expect(nextState.data).toHaveLength(1);
  });

  it("should handle addMany", () => {
    const extraItems: Assignment[] = [
      pendingAssignment,
      { ...pendingAssignment, id: "test-2", title: "Bai tap 2" },
    ];
    const nextState = assignmentsReducer(initialState, addMany(extraItems));
    expect(nextState.data).toHaveLength(2);
  });

  it("should handle setFilter", () => {
    const nextState = assignmentsReducer(initialState, setFilter("completed"));
    expect(nextState.filter).toBe("completed");
  });

  it("should handle setSearchQuery", () => {
    const nextState = assignmentsReducer(initialState, setSearchQuery("TypeScript"));
    expect(nextState.searchQuery).toBe("TypeScript");
  });

  it("should handle fetchAssignments.pending", () => {
    const state = assignmentsReducer(initialState, fetchAssignments.pending("", undefined));
    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("should handle fetchAssignments.fulfilled", () => {
    const state = assignmentsReducer(
      { ...initialState, status: "loading" },
      fetchAssignments.fulfilled([pendingAssignment], "", undefined)
    );
    expect(state.status).toBe("succeeded");
    expect(state.data).toEqual([pendingAssignment]);
  });

  it("should handle fetchAssignments.rejected voi payload", () => {
    const action = fetchAssignments.rejected(null, "", undefined, "Loi mang");
    const state = assignmentsReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Loi mang");
  });

  it("should handle fetchAssignments.rejected khong co payload", () => {
    const action = fetchAssignments.rejected(null, "", undefined, undefined);
    const state = assignmentsReducer(initialState, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Đã xảy ra lỗi không xác định.");
  });

  it("should handle addAssignment.pending", () => {
    const input = { title: "Moi", subject: "Toan", dueDate: "2099-01-01", priority: "low" as const };
    const state = assignmentsReducer(initialState, addAssignment.pending("", input));
    expect(state.addStatus).toBe("loading");
  });

  it("should handle addAssignment.fulfilled", () => {
    const newItem = { ...pendingAssignment, id: "new-1" };
    const input = { title: "Moi", subject: "Toan", dueDate: "2099-01-01", priority: "low" as const };
    const stateWithExisting = { ...initialState, data: [pendingAssignment] };
    const state = assignmentsReducer(stateWithExisting, addAssignment.fulfilled(newItem, "", input));
    expect(state.addStatus).toBe("idle");
    expect(state.data[0].id).toBe("new-1");
    expect(state.data).toHaveLength(2);
  });

  it("should handle addAssignment.rejected voi payload", () => {
    const input = { title: "Moi", subject: "Toan", dueDate: "2099-01-01", priority: "low" as const };
    const state = assignmentsReducer(
      initialState,
      addAssignment.rejected(null, "", input, "Khong the them")
    );
    expect(state.addStatus).toBe("failed");
    expect(state.error).toBe("Khong the them");
  });

  it("should handle addAssignment.rejected khong co payload", () => {
    const input = { title: "Moi", subject: "Toan", dueDate: "2099-01-01", priority: "low" as const };
    const state = assignmentsReducer(
      initialState,
      addAssignment.rejected(null, "", input, undefined)
    );
    expect(state.addStatus).toBe("failed");
    expect(state.error).toBe("Không thể thêm bài tập.");
  });

  const makeRoot = (
    filter: "all" | "pending" | "overdue" | "completed",
    searchQuery = "",
    data: Assignment[] = [pendingAssignment, overdueAssignment, completedAssignment]
  ): RootState =>
    ({
      assignments: { data, status: "succeeded", error: null, filter, addStatus: "idle", searchQuery },
    } as RootState);

  it("selectFilteredAssignments - filter all", () => {
    expect(selectFilteredAssignments(makeRoot("all"))).toHaveLength(3);
  });

  it("selectFilteredAssignments - filter completed", () => {
    const result = selectFilteredAssignments(makeRoot("completed"));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-3");
  });

  it("selectFilteredAssignments - filter overdue", () => {
    const result = selectFilteredAssignments(makeRoot("overdue"));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-2");
  });

  it("selectFilteredAssignments - filter pending", () => {
    const result = selectFilteredAssignments(makeRoot("pending"));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-1");
  });

  it("selectFilteredAssignments - searchQuery by title", () => {
    const result = selectFilteredAssignments(makeRoot("all", "typescript"));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-1");
  });

  it("selectFilteredAssignments - searchQuery by subject", () => {
    const result = selectFilteredAssignments(makeRoot("all", "toan"));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-2");
  });

  it("selectFilteredAssignments - searchQuery no match", () => {
    expect(selectFilteredAssignments(makeRoot("all", "xyz-no-match"))).toHaveLength(0);
  });

  it("selectFilteredAssignments - empty data", () => {
    expect(selectFilteredAssignments(makeRoot("all", "", []))).toHaveLength(0);
  });
});

