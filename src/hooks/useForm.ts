import { useState, useEffect } from 'react';
import { UserFormData, ApiResponse, SubmissionResult } from '../types';
import { apiClient } from '../utils/api';
import { urlStateManager } from '../utils/url';

interface UseFormState {
  formData: UserFormData;
  errors: Record<string, string>;
  isLoading: boolean;
  results: any[] | null;
}

interface UseFormActions {
  updateField: (field: keyof UserFormData, value: string) => void;
  submitForm: () => Promise<void>;
  clearErrors: () => void;
}

export const useForm = (): UseFormState & UseFormActions => {
  const [formData, setUserFormData] = useState<UserFormData>({
    date: '',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    const urlData = urlStateManager.decodeFormData();
    if (urlData.date || urlData.first_name || urlData.last_name) {
      const completeData = {
        date: urlData.date || '',
        first_name: urlData.first_name || '',
        last_name: urlData.last_name || '',
      };
      setUserFormData(completeData);
      
      if (completeData.date && completeData.first_name && completeData.last_name) {
        loadDataFromUrl(completeData);
      }
    }
  }, []);

  const loadDataFromUrl = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.submitUserForm(data);
      if (response.success) {
        setResults(response.data);
      } else {
        handleErrors(response.error);
      }
    } catch (error) {
      console.error('Failed to load data from URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof UserFormData, value: string) => {
    setUserFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleErrors = (errorObj: Record<string, string[]>) => {
    const newErrors: Record<string, string> = {};
    Object.keys(errorObj).forEach(field => {
      newErrors[field] = errorObj[field].join(', ');
    });
    setErrors(newErrors);
  };

  const submitForm = async () => {
    setIsLoading(true);
    clearErrors();
    setResults(null);

    try {
      const response: ApiResponse<SubmissionResult[]> = await apiClient.submitUserForm(formData);
      
      if (response.success) {
        setResults(response.data);
        urlStateManager.persistFormState(formData);
      } else {
        handleErrors(response.error);
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    isLoading,
    results,
    updateField,
    submitForm,
    clearErrors,
  };
};