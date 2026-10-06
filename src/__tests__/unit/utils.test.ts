import { isOverdue, calcDaysLeft, isAssignment, groupBy } from '../../features/assignments/utils/typeGuards';
import { generateSampleAssignments } from '../../features/assignments/utils/generateSampleData';
import { calcStats } from '../../features/assignments/components/StatsPage';
import { Assignment } from '../../types/assignment';

describe('Unit Tests — Utils & Type Guards', () => {
  describe('isOverdue', () => {
    it('returns false if completed is true regardless of date', () => {
      const pastDate = '2020-01-01T00:00:00.000Z';
      expect(isOverdue(pastDate, true)).toBe(false);
    });

    it('returns true if not completed and dueDate is in the past', () => {
      const pastDate = '2020-01-01T00:00:00.000Z';
      expect(isOverdue(pastDate, false)).toBe(true);
    });

    it('returns false if not completed and dueDate is far in the future', () => {
      const futureDate = '2099-01-01T00:00:00.000Z';
      expect(isOverdue(futureDate, false)).toBe(false);
    });
  });

  describe('calcDaysLeft', () => {
    const nowMs = new Date('2026-10-06T12:00:00.000Z').getTime();

    it('calculates positive days for future date', () => {
      const futureDate = '2026-10-08T12:00:00.000Z';
      expect(calcDaysLeft(futureDate, nowMs)).toBe(2);
    });

    it('returns 0 for due date equal to current time', () => {
      const sameDate = '2026-10-06T12:00:00.000Z';
      expect(calcDaysLeft(sameDate, nowMs)).toBe(0);
    });

    it('returns negative days for overdue date', () => {
      const pastDate = '2026-10-04T12:00:00.000Z';
      expect(calcDaysLeft(pastDate, nowMs)).toBe(-2);
    });
  });

  describe('calcStats', () => {
    it('handles empty assignments list', () => {
      const stats = calcStats([]);
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.overdue).toBe(0);
      expect(stats.completionRate).toBe(0);
      expect(Object.keys(stats.bySubject)).toHaveLength(0);
    });

    it('calculates correct statistics for sample assignments', () => {
      const sample: Assignment[] = [
        {
          id: '1',
          title: 'Bài 1',
          subject: 'Toán',
          dueDate: '2020-01-01T00:00:00.000Z',
          completed: true,
          priority: 'high',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Bài 2',
          subject: 'Toán',
          dueDate: '2020-01-01T00:00:00.000Z',
          completed: false,
          priority: 'medium',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Bài 3',
          subject: 'Lý',
          dueDate: '2099-01-01T00:00:00.000Z',
          completed: false,
          priority: 'low',
          createdAt: '2020-01-01T00:00:00.000Z',
        },
      ];

      const stats = calcStats(sample);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.overdue).toBe(1);
      expect(stats.completionRate).toBe(33);
      expect(stats.bySubject['Toán']).toEqual({ total: 2, completed: 1 });
      expect(stats.bySubject['Lý']).toEqual({ total: 1, completed: 0 });
    });
  });

  describe('isAssignment type guard', () => {
    it('returns false for non-object or null values', () => {
      expect(isAssignment(null)).toBe(false);
      expect(isAssignment(undefined)).toBe(false);
      expect(isAssignment('invalid')).toBe(false);
    });

    it('returns true for valid Assignment object', () => {
      const valid: Assignment = {
        id: 'a1',
        title: 'Title',
        subject: 'Subject',
        dueDate: '2026-10-10',
        completed: false,
        priority: 'high',
        createdAt: '2026-10-01',
      };
      expect(isAssignment(valid)).toBe(true);
    });
  });

  describe('groupBy', () => {
    it('groups array by key function', () => {
      const items = [
        { id: 1, type: 'A' },
        { id: 2, type: 'B' },
        { id: 3, type: 'A' },
      ];
      const grouped = groupBy(items, (item) => item.type);
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe('generateSampleAssignments', () => {
    it('generates specified number of valid assignments', () => {
      const samples = generateSampleAssignments(10, 12345);
      expect(samples).toHaveLength(10);
      expect(samples[0]).toHaveProperty('id');
      expect(samples[0]).toHaveProperty('title');
      expect(samples[0]).toHaveProperty('subject');
      expect(samples[0]).toHaveProperty('dueDate');
    });
  });
});
