export interface UserSubmission {
  date: string;
  first_name: string;
  last_name: string;
}

export interface ValidationError {
  [fieldName: string]: string[];
}

export interface SubmissionResponse {
  date: string;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ValidationError | { message: string };
}