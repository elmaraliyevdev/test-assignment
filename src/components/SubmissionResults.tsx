import React from 'react';
import { SubmissionResult } from '../types';

interface SubmissionResultsProps {
  results: SubmissionResult[];
  className?: string;
}

export const SubmissionResults: React.FC<SubmissionResultsProps> = ({ 
  results, 
  className = '' 
}) => {
  if (results.length === 0) return null;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-600 text-xl">✓</span>
        <h3 className="text-lg font-semibold text-green-800">
          Submission Successful
        </h3>
      </div>
      
      <p className="text-green-700 mb-4 text-sm">
        Your form has been processed. Here are the generated entries:
      </p>
      
      <div className="space-y-3">
        {results.map((entry, index) => (
          <div 
            key={`result-${index}`} 
            className="bg-white border-l-4 border-green-500 rounded-r-md p-4 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Date:</span>
                <span className="ml-2 text-gray-900">{entry.date}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-900">{entry.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};