import sqlite3 from 'sqlite3';
import path from 'path';

export interface SubmissionRecord {
  date: string;
  first_name: string;
  last_name: string;
}

export interface HistoryEntry {
  date: string;
  first_name: string;
  last_name: string;
  count: number;
}

export class Database {
  private connection: sqlite3.Database;
  private ready: Promise<void>;

  constructor(dbPath?: string) {
    const databasePath = dbPath || path.join(__dirname, 'submissions.db');
    this.connection = new sqlite3.Database(databasePath);
    this.ready = this.initializeSchema();
  }

  private initializeSchema(): Promise<void> {
    return new Promise((resolve, reject) => {
      const schema = `
        CREATE TABLE IF NOT EXISTS submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      this.connection.run(schema, (error) => {
        if (error) {
          console.error('Database initialization failed:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async saveSubmission(record: SubmissionRecord): Promise<void> {
    await this.ready;
    
    return new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO submissions (date, first_name, last_name)
        VALUES (?, ?, ?)
      `;
      
      const params = [record.date, record.first_name, record.last_name];
      
      this.connection.run(insertQuery, params, function(error) {
        if (error) {
          console.error('Failed to save submission:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async getSubmissionHistory(): Promise<HistoryEntry[]> {
    await this.ready;
    
    return new Promise((resolve, reject) => {
      // Complex query to get submissions with count of previous submissions by same person
      const historyQuery = `
        SELECT 
          current.date,
          current.first_name,
          current.last_name,
          COUNT(previous.id) as count
        FROM submissions current
        LEFT JOIN submissions previous ON 
          current.first_name = previous.first_name 
          AND current.last_name = previous.last_name 
          AND previous.date < current.date
        GROUP BY current.id, current.date, current.first_name, current.last_name
        ORDER BY current.date DESC, current.first_name ASC, current.last_name ASC
        LIMIT 10
      `;
      
      this.connection.all(historyQuery, [], (error, rows: any[]) => {
        if (error) {
          console.error('History query failed:', error);
          reject(error);
        } else {
          const entries: HistoryEntry[] = rows.map(row => ({
            date: row.date,
            first_name: row.first_name,
            last_name: row.last_name,
            count: row.count
          }));
          resolve(entries);
        }
      });
    });
  }
}