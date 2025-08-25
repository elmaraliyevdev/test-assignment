import { useState, useEffect, useCallback } from 'react';
import { UserFormData, ApiResponse, SubmissionResult, ValidationErrors } from '../types';
import { apiClient } from '../utils/api';
import { urlStateManager } from '../utils/url';

interface SubmissionState {
  formData: UserFormData;
  fieldErrors: Record<string, string>;
  isSubmitting: boolean;
  submissionResults: SubmissionResult[] | null;
}

export const useSubmissionForm = () => {
  const [state, setState] = useState<SubmissionState>({
    formData: {
      date: '',
      first_name: '',
      last_name: '',
    },
    fieldErrors: {},
    isSubmitting: false,
    submissionResults: null,
  });

  // Initialize form from URL parameters on mount
  useEffect(() => {
    const persistedData = urlStateManager.decodeFormData();
    
    if (urlStateManager.hasPersistedData()) {
      setState(prev => ({
        ...prev,
        formData: {
          date: persistedData.date || '',
          first_name: persistedData.first_name || '',
          last_name: persistedData.last_name || '',
        }
      }));
      
      // Auto-submit if we have complete data from URL
      const isComplete = persistedData.date && persistedData.first_name && persistedData.last_name;
      if (isComplete) {
        handleSubmitFromUrl(persistedData as UserFormData);
      }
    }
  }, []);

  const handleSubmitFromUrl = async (data: UserFormData) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const response = await apiClient.submitUserForm(data);
      processSubmissionResponse(response);
    } catch (error) {
      console.error('URL submission failed:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const updateFormField = useCallback((field: keyof UserFormData, value: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      // Clear field error when user starts typing
      fieldErrors: { ...prev.fieldErrors, [field]: '' },
    }));
  }, []);

  const processValidationErrors = (errors: ValidationErrors) => {
    const flattenedErrors: Record<string, string> = {};
    
    Object.entries(errors).forEach(([field, messages]) => {
      flattenedErrors[field] = messages.join(', ');
    });
    
    setState(prev => ({ ...prev, fieldErrors: flattenedErrors }));
  };

  const processSubmissionResponse = (response: ApiResponse<SubmissionResult[]>) => {
    if (response.success) {
      setState(prev => ({ 
        ...prev, 
        submissionResults: response.data,
        fieldErrors: {}
      }));
      urlStateManager.persistFormState(state.formData);
    } else {
      processValidationErrors(response.error);
    }
  };

  const handleFormSubmission = async () => {
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      fieldErrors: {}, 
      submissionResults: null 
    }));

    try {
      const response = await apiClient.submitUserForm(state.formData);
      processSubmissionResponse(response);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        fieldErrors: { general: 'Unable to submit form. Please check your connection.' }
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const resetForm = useCallback(() => {
    setState({
      formData: { date: '', first_name: '', last_name: '' },
      fieldErrors: {},
      isSubmitting: false,
      submissionResults: null,
    });
  }, []);

  return {
    ...state,
    updateFormField,
    handleFormSubmission,
    resetForm,
  };
};