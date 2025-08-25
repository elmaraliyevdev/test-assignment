import request from 'supertest';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { Database } from './database';

jest.mock('./database');

const app = express();
app.use(cors());
app.use(express.json());

const mockDb = {
  saveSubmission: jest.fn(),
  getSubmissionHistory: jest.fn(),
};

(Database as jest.MockedClass<typeof Database>).mockImplementation(() => mockDb as any);

function validateForm(data: { first_name?: string; last_name?: string }) {
  const errors: Record<string, string[]> = {};
  
  if (data.first_name && data.first_name.includes(' ')) {
    errors.first_name = ['No whitespace in first name is allowed'];
  }
  
  if (data.last_name && data.last_name.includes(' ')) {
    errors.last_name = ['No whitespace in last name is allowed'];
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

function generateRandomData(inputData: any) {
  const count = Math.floor(Math.random() * 4) + 2;
  const result = [];
  
  for (let i = 0; i < count; i++) {
    result.push({
      date: inputData.date,
      name: `${inputData.first_name} ${inputData.last_name}`
    });
  }
  
  return result;
}

function delay() {
  return new Promise(resolve => setTimeout(resolve, 10));
}

app.post('/submit', async (req, res) => {
  await delay();
  
  const { date, first_name, last_name } = req.body;
  
  const validationErrors = validateForm({ first_name, last_name });
  if (validationErrors) {
    return res.status(400).json({
      success: false,
      error: validationErrors
    });
  }
  
  try {
    await mockDb.saveSubmission({ date, first_name, last_name });
    
    const data = generateRandomData({ date, first_name, last_name });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { general: ['Database error'] }
    });
  }
});

app.get('/history', async (req, res) => {
  try {
    const history = await mockDb.getSubmissionHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.saveSubmission.mockResolvedValue(undefined);
    mockDb.getSubmissionHistory.mockResolvedValue([]);
  });

  describe('POST /submit', () => {
    it('should accept valid form data', async () => {
      const formData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      
      expect(mockDb.saveSubmission).toHaveBeenCalledWith(formData);
    });

    it('should reject first_name with whitespace', async () => {
      const formData = {
        date: '2025-01-01',
        first_name: 'John Doe',
        last_name: 'Smith'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.first_name).toEqual(['No whitespace in first name is allowed']);
      expect(mockDb.saveSubmission).not.toHaveBeenCalled();
    });

    it('should reject last_name with whitespace', async () => {
      const formData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe Smith'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.last_name).toEqual(['No whitespace in last name is allowed']);
      expect(mockDb.saveSubmission).not.toHaveBeenCalled();
    });

    it('should reject both fields with whitespace', async () => {
      const formData = {
        date: '2025-01-01',
        first_name: 'John Doe',
        last_name: 'Smith Jones'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.first_name).toEqual(['No whitespace in first name is allowed']);
      expect(response.body.error.last_name).toEqual(['No whitespace in last name is allowed']);
      expect(mockDb.saveSubmission).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockDb.saveSubmission.mockRejectedValue(new Error('Database connection failed'));

      const formData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.general).toEqual(['Database error']);
    });

    it('should generate correct response data format', async () => {
      const formData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      const response = await request(app)
        .post('/submit')
        .send(formData)
        .expect(200);

      response.body.data.forEach((item: any) => {
        expect(item).toHaveProperty('date', '2025-01-01');
        expect(item).toHaveProperty('name', 'John Doe');
      });
    });
  });

  describe('GET /history', () => {
    it('should return history data', async () => {
      const mockHistory = [
        { date: '2025-01-02', first_name: 'Jane', last_name: 'Doe', count: 1 },
        { date: '2025-01-01', first_name: 'John', last_name: 'Smith', count: 0 },
      ];

      mockDb.getSubmissionHistory.mockResolvedValue(mockHistory);

      const response = await request(app)
        .get('/history')
        .expect(200);

      expect(response.body).toEqual(mockHistory);
      expect(mockDb.getSubmissionHistory).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no history exists', async () => {
      mockDb.getSubmissionHistory.mockResolvedValue([]);

      const response = await request(app)
        .get('/history')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should handle database errors', async () => {
      mockDb.getSubmissionHistory.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/history')
        .expect(500);

      expect(response.body.error).toBe('Database error');
    });
  });
});

describe('Validation Functions', () => {
  describe('validateForm', () => {
    it('should return null for valid data', () => {
      const data = { first_name: 'John', last_name: 'Doe' };
      expect(validateForm(data)).toBeNull();
    });

    it('should return errors for whitespace in first_name', () => {
      const data = { first_name: 'John Doe', last_name: 'Smith' };
      const errors = validateForm(data);
      expect(errors?.first_name).toEqual(['No whitespace in first name is allowed']);
    });

    it('should return errors for whitespace in last_name', () => {
      const data = { first_name: 'John', last_name: 'Doe Smith' };
      const errors = validateForm(data);
      expect(errors?.last_name).toEqual(['No whitespace in last name is allowed']);
    });

    it('should handle empty strings', () => {
      const data = { first_name: '', last_name: '' };
      expect(validateForm(data)).toBeNull();
    });
  });

  describe('generateRandomData', () => {
    it('should generate between 2 and 5 items', () => {
      const inputData = { date: '2025-01-01', first_name: 'John', last_name: 'Doe' };
      const result = generateRandomData(inputData);
      
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should generate correct data format', () => {
      const inputData = { date: '2025-01-01', first_name: 'John', last_name: 'Doe' };
      const result = generateRandomData(inputData);
      
      result.forEach(item => {
        expect(item.date).toBe('2025-01-01');
        expect(item.name).toBe('John Doe');
      });
    });
  });
});