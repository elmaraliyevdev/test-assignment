import { UserSubmission, SubmissionResponse } from './types';

// Simulate processing time as per business requirements
export const simulateProcessingDelay = (): Promise<void> => {
  const maxDelay = 3000; // 3 seconds max
  const randomDelay = Math.random() * maxDelay;
  return new Promise(resolve => setTimeout(resolve, randomDelay));
};

// Generate sample data for demonstration purposes
export const createSampleResponseData = (input: UserSubmission): SubmissionResponse[] => {
  const itemCount = Math.floor(Math.random() * 4) + 2; // 2-5 items
  const fullName = `${input.first_name} ${input.last_name}`;
  
  return Array.from({ length: itemCount }, () => ({
    date: input.date,
    name: fullName
  }));
};