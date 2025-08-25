import React from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { HistoryTable } from '../components/HistoryTable';
import { useSubmissionHistory } from '../hooks/useHistory';

export const HistoryPage: React.FC = () => {
  const { history, isLoading, hasError, isEmpty, errorMessage } = useSubmissionHistory();

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" message="Loading submission history..." />
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-16 space-y-4">
      <div className="text-red-600 font-medium">
        ⚠ {errorMessage}
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 space-y-6">
      <div className="text-6xl text-gray-300 mb-4">📊</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">No Submissions Yet</h3>
        <p className="text-gray-500">Be the first to submit the form!</p>
      </div>
      <Link
        to="/form"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
      >
        Create First Submission
      </Link>
    </div>
  );

  return (
    <AppShell pageTitle="Submission History">
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState()}
      {isEmpty && renderEmptyState()}
      
      {!isLoading && !hasError && !isEmpty && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm leading-relaxed">
              📅 <strong>Last 10 submissions</strong> sorted by date (newest first). 
              The count indicates how many times the same person submitted before that particular date.
            </p>
          </div>
          
          <HistoryTable entries={history} />
        </div>
      )}
    </AppShell>
  );
};