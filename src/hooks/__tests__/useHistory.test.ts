import { renderHook, waitFor } from '@testing-library/react';
import { useSubmissionHistory } from '../useHistory';
import { apiClient } from '../../utils/api';

jest.mock('../../utils/api');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useSubmissionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockApiClient.fetchSubmissionHistory.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useSubmissionHistory());

    expect(result.current.history).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.errorMessage).toBeNull();
  });

  it('should load history successfully', async () => {
    const mockHistory = [
      { date: '2025-01-02', first_name: 'Jane', last_name: 'Doe', count: 1 },
      { date: '2025-01-01', first_name: 'John', last_name: 'Smith', count: 0 },
    ];

    mockApiClient.fetchSubmissionHistory.mockResolvedValue(mockHistory);

    const { result } = renderHook(() => useSubmissionHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.errorMessage).toBeNull();
    expect(mockApiClient.fetchSubmissionHistory).toHaveBeenCalledTimes(1);
  });

  it('should handle empty history', async () => {
    mockApiClient.fetchSubmissionHistory.mockResolvedValue([]);

    const { result } = renderHook(() => useSubmissionHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.errorMessage).toBeNull();
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network error';
    mockApiClient.fetchSubmissionHistory.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSubmissionHistory());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.errorMessage).toBe('Could not load submission history. Please refresh to try again.');
  });

  it('should call API on mount', () => {
    mockApiClient.fetchSubmissionHistory.mockResolvedValue([]);

    renderHook(() => useSubmissionHistory());

    expect(mockApiClient.fetchSubmissionHistory).toHaveBeenCalledTimes(1);
  });
});