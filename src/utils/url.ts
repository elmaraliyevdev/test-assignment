import { UserFormData } from '../types';

// URL state management utilities for form persistence
class UrlStateManager {
  private readonly FORM_FIELDS = ['date', 'first_name', 'last_name'] as const;

  encodeFormData(formData: UserFormData): string {
    const searchParams = new URLSearchParams();
    
    this.FORM_FIELDS.forEach(field => {
      const value = formData[field];
      if (value) {
        searchParams.set(field, value);
      }
    });
    
    return searchParams.toString();
  }

  decodeFormData(): Partial<UserFormData> {
    const searchParams = new URLSearchParams(window.location.search);
    
    return this.FORM_FIELDS.reduce((acc, field) => {
      acc[field] = searchParams.get(field) || '';
      return acc;
    }, {} as Record<string, string>);
  }

  persistFormState(formData: UserFormData): void {
    const queryString = this.encodeFormData(formData);
    const newUrl = `${window.location.pathname}?${queryString}`;
    
    // Update URL without triggering navigation
    window.history.pushState(formData, '', newUrl);
  }

  hasPersistedData(): boolean {
    return window.location.search.length > 0;
  }
}

export const urlStateManager = new UrlStateManager();