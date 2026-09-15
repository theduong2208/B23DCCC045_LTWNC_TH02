# Student Deadline Tracker

Ứng dụng quản lý deadline bài tập cá nhân — React + TypeScript + Redux Toolkit.

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ mà Vite in ra (mặc định `http://localhost:5173`).

Build production: `npm run build` (chạy `tsc -b` để type-check trước khi build).

## Cấu trúc thư mục (feature-based)

```
src/
  app/
    store.ts          # configureStore
    hooks.ts          # useAppDispatch / useAppSelector đã gõ kiểu
  features/
    assignments/
      assignmentsAPI.ts      # API giả lập (delay + dữ liệu mẫu)
      assignmentsSlice.ts     # createSlice + createAsyncThunk + selectors
      hooks/
        useCountdown.ts       # custom hook nâng cao: đếm ngược hạn nộp
        useLocalStorage.ts    # custom hook generic tái sử dụng
      utils/
        typeGuards.ts         # type guard + generic groupBy
      components/
        AssignmentForm.tsx
        FilterBar.tsx
        AssignmentList.tsx     # = withLoading(AssignmentListBase)
        AssignmentListBase.tsx
        AssignmentItem.tsx
        AssignmentCard/         # Compound Component pattern
          AssignmentCard.tsx
          index.ts
  hoc/
    withLoading.tsx     # Higher-Order Component pattern
  types/
    assignment.ts       # generic + utility types (Omit/Pick/Partial)
  styles/
    index.css
  App.tsx
  main.tsx
```

## Đối chiếu với yêu cầu buổi học

**Buổi 1 — TypeScript nâng cao**
- Generic: `ApiResponse<T>`, `AsyncState<T>`, hàm `groupBy<T, K>`, hook `useLocalStorage<T>`.
- Utility types: `Omit`, `Pick`, `Partial` trong `types/assignment.ts` để tạo `NewAssignmentInput`, `UpdateAssignmentInput`, `AssignmentWithDerived`.
- Type guard: `isPriority`, `isAssignment`, `filterValidAssignments` trong `utils/typeGuards.ts`.

**Buổi 2 — Design pattern React**
- Custom hook nâng cao: `useCountdown` (tự làm mới đếm ngược theo chu kỳ, tính "Còn X ngày" / "Quá hạn Y ngày").
- Compound Component: `AssignmentCard` với `Header / Body / Countdown / Footer`, chia sẻ dữ liệu qua Context nội bộ.
- Higher-Order Component: `withLoading` bọc `AssignmentListBase` để xử lý trạng thái loading/error dùng chung.

**Buổi 3 — Redux Toolkit + TypeScript**
- Feature-based structure trong `features/assignments/`.
- Typed hooks: `useAppDispatch`, `useAppSelector` (dựa trên `RootState`, `AppDispatch`).
- `createAsyncThunk`: `fetchAssignments` (lấy dữ liệu mẫu khi khởi động app) và `addAssignment` (gọi API giả lập khi thêm bài tập).

## Đối chiếu với yêu cầu chức năng

| # | Yêu cầu | Vị trí xử lý |
|---|---------|--------------|
| 1 | Hiển thị danh sách bài tập | `AssignmentList` + `AssignmentCard` |
| 2 | Thêm bài tập qua form | `AssignmentForm` + thunk `addAssignment` |
| 3 | Đánh dấu hoàn thành / bỏ đánh dấu | action `toggleCompleted` |
| 4 | Xoá bài tập | action `removeAssignment` |
| 5 | Lọc theo trạng thái | `FilterBar` + selector `selectFilteredAssignments` |
| 6 | "Còn X ngày" / "Quá hạn Y ngày" | hook `useCountdown` |
| 7 | Lấy danh sách mẫu từ API giả lập khi khởi động | `assignmentsAPI.fetchAll` + `fetchAssignments` gọi trong `useEffect` của `App.tsx` |
