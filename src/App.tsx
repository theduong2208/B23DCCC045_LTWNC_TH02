import { lazy, Suspense, useEffect, useState } from 'react';
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
import { SearchBar } from './features/assignments/components/SearchBar';
import { AssignmentList } from './features/assignments/components/AssignmentList';

// ------------------------------------------------------------------
// React.lazy + Suspense cho StatsPage:
// Trang thống kê không cần thiết khi load lần đầu →
// lazy load giúp giảm initial bundle, cải thiện LCP.
//
// Chỗ KHÔNG dùng lazy: AssignmentList (luôn hiển thị ngay)
// ------------------------------------------------------------------
const StatsPage = lazy(() => import('./features/assignments/components/StatsPage'));

type ActiveView = 'list' | 'stats';

export default function App() {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(selectFilteredAssignments);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('list');

  // Yêu cầu #7: lấy danh sách mẫu ban đầu từ API giả lập khi khởi động app.
  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  return (
    <div className="app-shell">
      {/* Sidebar — truyền callback để đổi view */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main area */}
      <div className="main-area">
        {/* Top header */}
        <Header onAddClick={() => setIsModalOpen(true)} />

        {/* Page content */}
        <main className="page-content">
          {activeView === 'stats' ? (
            // Lazy load StatsPage với fallback loading
            <Suspense
              fallback={
                <div className="state-panel">
                  <p>⏳ Đang tải thống kê...</p>
                </div>
              }
            >
              <StatsPage />
            </Suspense>
          ) : (
            <>
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

              {/* Ô tìm kiếm debounced */}
              <SearchBar />

              <AssignmentList
                isLoading={status === 'loading' && assignments.length === 0}
                error={status === 'failed' ? error : null}
                assignments={assignments}
              />
            </>
          )}
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
