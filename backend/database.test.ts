import { Database, SubmissionRecord } from './database';
import fs from 'fs';
import path from 'path';

describe('Database', () => {
  let db: Database;
  let testDbPath: string;

  beforeEach(() => {
    testDbPath = path.join(__dirname, `test-${Date.now()}-${Math.random()}.sqlite`);
    db = new Database(testDbPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('saveSubmission', () => {
    it('should insert a submission successfully', async () => {
      const submission: SubmissionRecord = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe',
      };

      await expect(db.saveSubmission(submission)).resolves.not.toThrow();
    });

    it('should insert multiple submissions', async () => {
      const submissions: SubmissionRecord[] = [
        { date: '2025-01-01', first_name: 'John', last_name: 'Doe' },
        { date: '2025-01-02', first_name: 'Jane', last_name: 'Smith' },
      ];

      for (const submission of submissions) {
        await expect(db.saveSubmission(submission)).resolves.not.toThrow();
      }
    });
  });

  describe('getSubmissionHistory', () => {
    it('should return empty array when no submissions exist', async () => {
      const history = await db.getSubmissionHistory();
      expect(history).toEqual([]);
    });

    it('should return submissions ordered by date DESC', async () => {
      const submissions: SubmissionRecord[] = [
        { date: '2025-01-01', first_name: 'John', last_name: 'Doe' },
        { date: '2025-01-03', first_name: 'Jane', last_name: 'Smith' },
        { date: '2025-01-02', first_name: 'Bob', last_name: 'Wilson' },
      ];

      for (const submission of submissions) {
        await db.saveSubmission(submission);
      }

      const history = await db.getSubmissionHistory();
      
      expect(history).toHaveLength(3);
      expect(history[0].date).toBe('2025-01-03');
      expect(history[1].date).toBe('2025-01-02');
      expect(history[2].date).toBe('2025-01-01');
    });

    it('should calculate correct count of previous submissions by same person', async () => {
      const submissions: SubmissionRecord[] = [
        { date: '2025-01-01', first_name: 'John', last_name: 'Smith' },
        { date: '2025-01-02', first_name: 'John', last_name: 'Smith' },
        { date: '2025-01-03', first_name: 'John', last_name: 'Smith' },
        { date: '2025-01-01', first_name: 'Jane', last_name: 'Doe' },
        { date: '2025-01-04', first_name: 'Jane', last_name: 'Doe' },
      ];

      for (const submission of submissions) {
        await db.saveSubmission(submission);
      }

      const history = await db.getSubmissionHistory();
      
      const johnLatest = history.find(h => h.date === '2025-01-03' && h.first_name === 'John');
      const johnSecond = history.find(h => h.date === '2025-01-02' && h.first_name === 'John');
      const johnFirst = history.find(h => h.date === '2025-01-01' && h.first_name === 'John');
      const janeLatest = history.find(h => h.date === '2025-01-04' && h.first_name === 'Jane');
      const janeFirst = history.find(h => h.date === '2025-01-01' && h.first_name === 'Jane');

      expect(johnLatest?.count).toBe(2);
      expect(johnSecond?.count).toBe(1);
      expect(johnFirst?.count).toBe(0);
      expect(janeLatest?.count).toBe(1);
      expect(janeFirst?.count).toBe(0);
    });

    it('should limit results to 10 entries', async () => {
      const submissions: SubmissionRecord[] = Array.from({ length: 15 }, (_, i) => ({
        date: `2025-01-${String(i + 1).padStart(2, '0')}`,
        first_name: 'John',
        last_name: 'Doe',
      }));

      for (const submission of submissions) {
        await db.saveSubmission(submission);
      }

      const history = await db.getSubmissionHistory();
      expect(history).toHaveLength(10);
    });
  });
});