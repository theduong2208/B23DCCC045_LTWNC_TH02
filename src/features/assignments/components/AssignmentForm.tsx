import React, { useState } from 'react';
import { NewAssignmentInput, PRIORITIES, Priority } from '../../../types/assignment';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addAssignment, selectAddStatus } from '../assignmentsSlice';

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

const EMPTY_FORM: NewAssignmentInput = {
  subject: '',
  title: '',
  dueDate: '',
  priority: 'medium',
};

interface AssignmentFormProps {
  onSuccess?: () => void;
}

export function AssignmentForm({ onSuccess }: AssignmentFormProps = {}) {
  const dispatch = useAppDispatch();
  const addStatus = useAppSelector(selectAddStatus);
  const [form, setForm] = useState<NewAssignmentInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  function handleChange<K extends keyof NewAssignmentInput>(field: K, value: NewAssignmentInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.subject.trim() || !form.title.trim() || !form.dueDate) {
      setFormError('Vui lòng điền đầy đủ môn học, tên bài tập và hạn nộp.');
      return;
    }

    setFormError(null);
    dispatch(addAssignment({ ...form, dueDate: new Date(form.dueDate).toISOString() }));
    setForm(EMPTY_FORM);
    onSuccess?.();
  }

  return (
    <form className="a-form" onSubmit={handleSubmit}>
      <h2 className="a-form__title">Thêm bài tập mới</h2>

      <div className="a-form__row">
        <label htmlFor="subject">Môn học</label>
        <input
          id="subject"
          type="text"
          value={form.subject}
          placeholder="VD: Lập trình Web"
          onChange={(e) => handleChange('subject', e.target.value)}
        />
      </div>

      <div className="a-form__row">
        <label htmlFor="title">Tên bài tập</label>
        <input
          id="title"
          type="text"
          value={form.title}
          placeholder="VD: Đồ án cuối kỳ"
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div className="a-form__row-group">
        <div className="a-form__row">
          <label htmlFor="dueDate">Hạn nộp</label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>

        <div className="a-form__row">
          <label htmlFor="priority">Độ ưu tiên</label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value as Priority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formError && <p className="a-form__error">{formError}</p>}

      <button type="submit" className="btn btn--primary" disabled={addStatus === 'loading'}>
        {addStatus === 'loading' ? 'Đang thêm...' : 'Thêm bài tập'}
      </button>
    </form>
  );
}
