import { apiClient } from '../api';
import { UserFormData } from '../../types';

global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('submitForm', () => {
    it('should submit form data successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { date: '2025-01-01', name: 'John Doe' },
          { date: '2025-01-01', name: 'John Doe' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      } as Response);

      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      const result = await apiClient.submitUserForm(formData);

      expect(mockFetch).toHaveBeenCalledWith('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors (400 status)', async () => {
      const mockErrorResponse = {
        success: false,
        error: {
          first_name: ['No whitespace in first name is allowed']
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      } as Response);

      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John Doe',
        last_name: 'Smith'
      };

      const result = await apiClient.submitUserForm(formData);
      expect(result).toEqual(mockErrorResponse);
    });

    it('should throw error for non-400 HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(apiClient.submitUserForm(formData)).rejects.toThrow('Network error occurred');
    });

    it('should throw error for fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(apiClient.submitUserForm(formData)).rejects.toThrow('Network error');
    });
  });

  describe('getHistory', () => {
    it('should fetch history successfully', async () => {
      const mockHistory = [
        { date: '2025-01-02', first_name: 'Jane', last_name: 'Doe', count: 1 },
        { date: '2025-01-01', first_name: 'John', last_name: 'Smith', count: 0 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory,
      } as Response);

      const result = await apiClient.fetchSubmissionHistory();

      expect(mockFetch).toHaveBeenCalledWith('/api/history');
      expect(result).toEqual(mockHistory);
    });

    it('should throw error for HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(apiClient.fetchSubmissionHistory()).rejects.toThrow('Failed to fetch history');
    });

    it('should throw error for fetch failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.fetchSubmissionHistory()).rejects.toThrow('Network error');
    });
  });
});