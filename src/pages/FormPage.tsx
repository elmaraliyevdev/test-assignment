import React from 'react';
import { AppShell } from '../components/AppShell';
import { FormField } from '../components/FormField';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SubmissionResults } from '../components/SubmissionResults';
import { useSubmissionForm } from '../hooks/useSubmissionForm';

export const FormPage: React.FC = () => {
  const {
    formData,
    fieldErrors,
    isSubmitting,
    submissionResults,
    updateFormField,
    handleFormSubmission,
  } = useSubmissionForm();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmission();
  };

  const isFormValid = formData.date && formData.first_name && formData.last_name;

  return (
    <AppShell pageTitle="Submit Your Information">
      <div className="max-w-md mx-auto">
        <form onSubmit={onFormSubmit} className="space-y-6">
          <FormField
            id="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={(value) => updateFormField('date', value)}
            error={fieldErrors.date}
            required
          />
          
          <FormField
            id="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={(value) => updateFormField('first_name', value)}
            error={fieldErrors.first_name}
            placeholder="Enter your first name"
            required
          />
          
          <FormField
            id="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={(value) => updateFormField('last_name', value)}
            error={fieldErrors.last_name}
            placeholder="Enter your last name"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium
                     hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60
                     transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            {isSubmitting ? 'Processing...' : 'Submit Form'}
          </button>

          {fieldErrors.general && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              <span className="font-medium">⚠ {fieldErrors.general}</span>
            </div>
          )}
        </form>

        {submissionResults && (
          <SubmissionResults 
            results={submissionResults} 
            className="mt-8"
          />
        )}
      </div>
    </AppShell>
  );
};