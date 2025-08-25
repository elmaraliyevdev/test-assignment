import React from 'react';
import { SubmissionHistoryEntry } from '../types';

interface HistoryTableProps {
  entries: SubmissionHistoryEntry[];
  className?: string;
}

const formatDisplayDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString; // Fallback to original string if parsing fails
  }
};

export const HistoryTable: React.FC<HistoryTableProps> = ({ 
  entries, 
  className = '' 
}) => {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-6 py-4 text-left font-semibold">Submission Date</th>
            <th className="px-6 py-4 text-left font-semibold">First Name</th>
            <th className="px-6 py-4 text-left font-semibold">Last Name</th>
            <th className="px-6 py-4 text-left font-semibold">Prior Count</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const isEvenRow = index % 2 === 0;
            const rowClasses = `
              border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150
              ${isEvenRow ? 'bg-white' : 'bg-gray-50'}
            `.trim();
            
            return (
              <tr key={`entry-${index}-${entry.date}`} className={rowClasses}>
                <td className="px-6 py-4 text-gray-900">
                  {formatDisplayDate(entry.date)}
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {entry.first_name}
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {entry.last_name}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 font-bold text-sm rounded-full">
                    {entry.count}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};