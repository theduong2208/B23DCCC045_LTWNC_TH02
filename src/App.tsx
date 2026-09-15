import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  fetchAssignments,
  selectFilteredAssignments,
  selectStatus,
  selectError,
} from './features/assignments/assignmentsSlice';
import { Sidebar } from './features/assignments/components/Sidebar';
import { Header } from './features/assignments/components/Header';
import { WelcomeBanner } from './features/assignments/components/WelcomeBanner';
import { AddModal } from './features/assignments/components/AddModal';
import { FilterBar } from './features/assignments/components/FilterBar';
import { AssignmentList } from './features/assignments/components/AssignmentList';

export default function App() {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(selectFilteredAssignments);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Yêu cầu #7: lấy danh sách mẫu ban đầu từ API giả lập khi khởi động app.
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="main-area">
        {/* Top header */}
        <Header onAddClick={() => setIsModalOpen(true)} />

        {/* Page content */}
        <main className="page-content">
          {/* Welcome banner + stats */}
          <WelcomeBanner />

          {/* Assignment section */}
          <div className="section-header">
            <div className="section-header__left">
              <h2 className="section-title">📋 Danh sách bài tập</h2>
              <FilterBar />
            </div>
            <button
              id="section-add-btn"
              type="button"
              className="btn btn--outline"
              onClick={() => setIsModalOpen(true)}
            >
              ＋ Thêm mới
            </button>
          </div>

          <AssignmentList
            isLoading={status === 'loading' && assignments.length === 0}
            error={status === 'failed' ? error : null}
            assignments={assignments}
          />
        </main>
      </div>

      {/* Add assignment modal */}
      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
