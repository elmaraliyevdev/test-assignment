// User input types
export interface UserFormData {
  date: string;
  first_name: string;
  last_name: string;
}

// API response types
export interface SubmissionResult {
  date: string;
  name: string;
}

export interface ValidationErrors {
  [fieldName: string]: string[];
}

// API response wrapper types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ValidationErrors;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// History data structure
export interface SubmissionHistoryEntry {
  date: string;
  first_name: string;
  last_name: string;
  count: number;
}