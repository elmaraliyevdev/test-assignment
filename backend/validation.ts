import { UserSubmission, ValidationError } from './types';

const VALIDATION_MESSAGES = {
  FIRST_NAME_WHITESPACE: 'No whitespace in first name is allowed',
  LAST_NAME_WHITESPACE: 'No whitespace in last name is allowed'
} as const;

const hasWhitespace = (text: string): boolean => /\s/.test(text);

export const validateSubmission = (data: UserSubmission): ValidationError | null => {
  const errors: ValidationError = {};
  
  if (data.first_name && hasWhitespace(data.first_name)) {
    errors.first_name = [VALIDATION_MESSAGES.FIRST_NAME_WHITESPACE];
  }
  
  if (data.last_name && hasWhitespace(data.last_name)) {
    errors.last_name = [VALIDATION_MESSAGES.LAST_NAME_WHITESPACE];
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};