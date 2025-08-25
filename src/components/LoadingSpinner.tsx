import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message,
  className = '' 
}) => {
  const spinnerClasses = `
    inline-block animate-spin rounded-full border-2 border-solid 
    border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]
    ${SPINNER_SIZES[size]} ${className}
  `.trim();

  const content = (
    <>
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {message && (
        <span className="ml-3 text-gray-600">{message}</span>
      )}
    </>
  );

  return message ? (
    <div className="flex items-center justify-center">
      {content}
    </div>
  ) : content;
};