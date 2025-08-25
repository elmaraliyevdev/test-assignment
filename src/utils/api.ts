import { 
  UserFormData, 
  ApiResponse, 
  SubmissionResult, 
  SubmissionHistoryEntry 
} from '../types';

const BASE_URL = '/api';

class ApiClient {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      // Handle validation errors (400) as successful responses
      if (response.status === 400) {
        return data;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async submitUserForm(formData: UserFormData): Promise<ApiResponse<SubmissionResult[]>> {
    return this.makeRequest('/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async fetchSubmissionHistory(): Promise<SubmissionHistoryEntry[]> {
    return this.makeRequest('/history');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();