import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'date' | 'email';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
}) => {
  const hasError = Boolean(error);
  
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${hasError 
      ? 'border-red-400 bg-red-50 focus:ring-red-500' 
      : 'border-gray-300 bg-white hover:border-gray-400'
    }
  `.trim();

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-red-600 flex items-start gap-1">
          <span className="text-red-500 mt-0.5">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};