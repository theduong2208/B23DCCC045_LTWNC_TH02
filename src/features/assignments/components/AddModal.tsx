import { useEffect } from 'react';
import { AssignmentForm } from './AssignmentForm';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddModal({ isOpen, onClose }: AddModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="add-modal-backdrop"
      className="modal-backdrop"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'add-modal-backdrop') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Thêm bài tập mới"
    >
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">📝 Thêm bài tập mới</h2>
          <button
            id="modal-close-btn"
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
        <div className="modal__body">
          <AssignmentForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
