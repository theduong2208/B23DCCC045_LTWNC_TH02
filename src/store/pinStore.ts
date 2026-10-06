import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ------------------------------------------------------------------
// PinStore — quản lý danh sách bài tập được ghim.
//
// Lý do dùng Zustand thay vì Redux:
// • State này là UI-local: chỉ ảnh hưởng đến thứ tự hiển thị,
//   không cần đồng bộ với server hay chia sẻ phức tạp giữa nhiều slice.
// • Zustand cho phép định nghĩa gọn trong 1 file, không cần action/reducer/selector riêng.
// • persist middleware tự lưu vào localStorage mà không cần viết thêm code.
// ------------------------------------------------------------------

interface PinStore {
  /** Set chứa id các bài tập đang được ghim */
  pinnedIds: Set<string>;
  /** Ghim hoặc bỏ ghim một bài tập theo id */
  togglePin: (id: string) => void;
  /** Kiểm tra một bài tập có đang được ghim không */
  isPinned: (id: string) => boolean;
}

/**
 * Zustand không serialize Set nên ta cần custom storage.
 */
export const usePinStore = create<PinStore>()(
  persist(
    (set, get) => ({
      pinnedIds: new Set<string>(),

      togglePin(id: string) {
        set((state) => {
          const next = new Set(state.pinnedIds);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return { pinnedIds: next };
        });
      },

      isPinned(id: string): boolean {
        return get().pinnedIds.has(id);
      },
    }),
    {
      name: 'pin-store', // key trong localStorage
      // Chuyển Set ↔ Array khi lưu/đọc localStorage
      storage: {
        getItem(key) {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const parsed = JSON.parse(raw) as { state: { pinnedIds: string[] } };
          return {
            ...parsed,
            state: {
              ...parsed.state,
              pinnedIds: new Set(parsed.state.pinnedIds),
            },
          };
        },
        setItem(key, value) {
          const serializable = {
            ...value,
            state: {
              ...value.state,
              pinnedIds: Array.from(value.state.pinnedIds),
            },
          };
          localStorage.setItem(key, JSON.stringify(serializable));
        },
        removeItem(key) {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
