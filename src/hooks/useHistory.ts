import { useState, useEffect } from 'react';
import { SubmissionHistoryEntry } from '../types';
import { apiClient } from '../utils/api';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface HistoryState {
  entries: SubmissionHistoryEntry[];
  loadingState: LoadingState;
  errorMessage: string | null;
}

export const useSubmissionHistory = () => {
  const [state, setState] = useState<HistoryState>({
    entries: [],
    loadingState: 'loading',
    errorMessage: null,
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchHistory = async () => {
      try {
        setState(prev => ({ 
          ...prev, 
          loadingState: 'loading', 
          errorMessage: null 
        }));
        
        const historyData = await apiClient.fetchSubmissionHistory();
        
        if (isMounted) {
          setState({
            entries: historyData,
            loadingState: 'success',
            errorMessage: null,
          });
        }
      } catch (err) {
        console.error('History fetch failed:', err);
        
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loadingState: 'error',
            errorMessage: 'Could not load submission history. Please refresh to try again.',
          }));
        }
      }
    };

    fetchHistory();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = state.loadingState === 'loading';
  const hasError = state.loadingState === 'error';
  const isEmpty = state.loadingState === 'success' && state.entries.length === 0;

  return {
    history: state.entries,
    isLoading,
    hasError,
    isEmpty,
    errorMessage: state.errorMessage,
  };
};