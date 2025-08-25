import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import { apiClient } from '../../utils/api';
import { urlStateManager } from '../../utils/url';

jest.mock('../../utils/api');
jest.mock('../../utils/url');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockUrlStateManager = urlStateManager as jest.Mocked<typeof urlStateManager>;

describe('useForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUrlStateManager.decodeFormData.mockReturnValue({
      date: '',
      first_name: '',
      last_name: ''
    });
  });

  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.formData).toEqual({
      date: '',
      first_name: '',
      last_name: ''
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toBeNull();
  });

  it('should update form field', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateField('first_name', 'John');
    });

    expect(result.current.formData.first_name).toBe('John');
  });

  it('should clear error when updating field', () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateField('first_name', 'John Doe');
    });

    // Simulate having an error
    act(() => {
      result.current.clearErrors();
    });

    act(() => {
      result.current.updateField('first_name', 'John');
    });

    expect(result.current.errors.first_name).toBeUndefined();
  });

  it('should submit form successfully', async () => {
    const mockResponse = {
      success: true as const,
      data: [{ date: '2025-01-01', name: 'John Doe' }]
    };

    mockApiClient.submitUserForm.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateField('date', '2025-01-01');
      result.current.updateField('first_name', 'John');
      result.current.updateField('last_name', 'Doe');
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(mockApiClient.submitUserForm).toHaveBeenCalledWith({
      date: '2025-01-01',
      first_name: 'John',
      last_name: 'Doe'
    });

    expect(result.current.results).toEqual(mockResponse.data);
    expect(result.current.isLoading).toBe(false);
    expect(mockUrlStateManager.persistFormState).toHaveBeenCalled();
  });

  it('should handle form submission errors', async () => {
    const mockErrorResponse = {
      success: false as const,
      error: { first_name: ['No whitespace in first name is allowed'] }
    };

    mockApiClient.submitUserForm.mockResolvedValue(mockErrorResponse);

    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.updateField('first_name', 'John Doe');
    });

    await act(async () => {
      await result.current.submitForm();
    });

    expect(result.current.errors.first_name).toBe('No whitespace in first name is allowed');
    expect(result.current.results).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle network errors', async () => {
    mockApiClient.submitUserForm.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useForm());

    await act(async () => {
      await result.current.submitForm();
    });

    expect(result.current.errors.general).toBe('Network error occurred');
    expect(result.current.isLoading).toBe(false);
  });

  it('should load form data from URL on initialization', () => {
    mockUrlStateManager.decodeFormData.mockReturnValue({
      date: '2025-01-01',
      first_name: 'John',
      last_name: 'Doe'
    });

    const { result } = renderHook(() => useForm());

    expect(result.current.formData).toEqual({
      date: '2025-01-01',
      first_name: 'John',
      last_name: 'Doe'
    });
  });

  it('should load data from server when URL has complete form data', async () => {
    const mockResponse = {
      success: true as const,
      data: [{ date: '2025-01-01', name: 'John Doe' }]
    };

    mockUrlStateManager.decodeFormData.mockReturnValue({
      date: '2025-01-01',
      first_name: 'John',
      last_name: 'Doe'
    });

    mockApiClient.submitUserForm.mockResolvedValue(mockResponse);

    renderHook(() => useForm());

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockApiClient.submitUserForm).toHaveBeenCalledWith({
      date: '2025-01-01',
      first_name: 'John',
      last_name: 'Doe'
    });
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useForm());

    // Simulate having errors
    act(() => {
      result.current.updateField('first_name', 'John');
    });

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual({});
  });
});