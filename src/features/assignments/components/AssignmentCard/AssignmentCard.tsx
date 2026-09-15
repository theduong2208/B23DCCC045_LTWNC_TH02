import React, { createContext, useContext } from 'react';
import { Assignment, Priority } from '../../../../types/assignment';
import { useCountdown } from '../../hooks/useCountdown';

// ------------------------------------------------------------------
// Compound Component pattern (Buổi 2)
// <AssignmentCard assignment={a}>
//   <AssignmentCard.Header />
//   <AssignmentCard.Body />
//   <AssignmentCard.Countdown />
//   <AssignmentCard.Footer>...actions...</AssignmentCard.Footer>
// </AssignmentCard>
// ------------------------------------------------------------------

interface AssignmentCardContextValue {
  assignment: Assignment;
}

const AssignmentCardContext = createContext<AssignmentCardContextValue | null>(null);

function useAssignmentCardContext(componentName: string): AssignmentCardContextValue {
  const ctx = useContext(AssignmentCardContext);
  if (!ctx) {
    throw new Error(`${componentName} phải được đặt bên trong <AssignmentCard>.`);
  }
  return ctx;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'Cao',
  medium: 'TB',
  low: 'Thấp',
};

interface RootProps {
  assignment: Assignment;
  children: React.ReactNode;
}

function Root({ assignment, children }: RootProps) {
  return (
    <AssignmentCardContext.Provider value={{ assignment }}>
      <article
        className={[
          'a-card',
          `a-card--${assignment.priority}`,
          assignment.completed ? 'a-card--done' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Info section — wraps Header + Body */}
        <div className="a-card__info">
          {children}
        </div>
      </article>
    </AssignmentCardContext.Provider>
  );
}

function Header() {
  const { assignment } = useAssignmentCardContext('AssignmentCard.Header');
  return (
    <header className="a-card__header">
      <span className="a-card__subject">{assignment.subject}</span>
      <span className={`a-card__priority-pill a-card__priority-pill--${assignment.priority}`}>
        {PRIORITY_LABEL[assignment.priority]}
      </span>
    </header>
  );
}

function Body() {
  const { assignment } = useAssignmentCardContext('AssignmentCard.Body');
  const dueDateLabel = new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return (
    <div className="a-card__body-inner">
      <h3 className="a-card__title">{assignment.title}</h3>
      <p className="a-card__due">📅 Hạn nộp: {dueDateLabel}</p>
    </div>
  );
}

function Countdown() {
  const { assignment } = useAssignmentCardContext('AssignmentCard.Countdown');
  const { label, isOverdue } = useCountdown(assignment.dueDate, assignment.completed);
  return (
    <span className={`a-card__countdown ${isOverdue ? 'a-card__countdown--overdue' : ''}`}>
      {label}
    </span>
  );
}

interface FooterProps {
  children: React.ReactNode;
}

function Footer({ children }: FooterProps) {
  return <div className="a-card__actions">{children}</div>;
}

export const AssignmentCard = Object.assign(Root, {
  Header,
  Body,
  Countdown,
  Footer,
});
