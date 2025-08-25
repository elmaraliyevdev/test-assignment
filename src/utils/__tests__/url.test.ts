import { urlStateManager } from '../url';
import { UserFormData } from '../../types';

const mockPushState = jest.fn();
const mockLocation = {
  pathname: '/form',
  search: '',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: { pushState: mockPushState },
  writable: true,
});

describe('urlStateManager', () => {
  beforeEach(() => {
    mockPushState.mockClear();
    mockLocation.search = '';
  });

  describe('encodeFormData', () => {
    it('should serialize form data to URL parameters', () => {
      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      const result = urlStateManager.encodeFormData(formData);
      
      expect(result).toBe('date=2025-01-01&first_name=John&last_name=Doe');
    });

    it('should handle special characters', () => {
      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John & Jane',
        last_name: 'O\'Connor'
      };

      const result = urlStateManager.encodeFormData(formData);
      
      expect(result).toBe('date=2025-01-01&first_name=John+%26+Jane&last_name=O%27Connor');
    });

    it('should handle empty values', () => {
      const formData: UserFormData = {
        date: '',
        first_name: '',
        last_name: ''
      };

      const result = urlStateManager.encodeFormData(formData);
      
      expect(result).toBe('date=&first_name=&last_name=');
    });
  });

  describe('decodeFormData', () => {
    it('should deserialize URL parameters to form data', () => {
      mockLocation.search = '?date=2025-01-01&first_name=John&last_name=Doe';

      const result = urlStateManager.decodeFormData();
      
      expect(result).toEqual({
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      });
    });

    it('should handle empty URL parameters', () => {
      mockLocation.search = '';

      const result = urlStateManager.decodeFormData();
      
      expect(result).toEqual({
        date: '',
        first_name: '',
        last_name: ''
      });
    });

    it('should handle partial URL parameters', () => {
      mockLocation.search = '?date=2025-01-01&first_name=John';

      const result = urlStateManager.decodeFormData();
      
      expect(result).toEqual({
        date: '2025-01-01',
        first_name: 'John',
        last_name: ''
      });
    });

    it('should handle URL encoded values', () => {
      mockLocation.search = '?date=2025-01-01&first_name=John%20Doe&last_name=O%27Connor';

      const result = urlStateManager.decodeFormData();
      
      expect(result).toEqual({
        date: '2025-01-01',
        first_name: 'John Doe',
        last_name: 'O\'Connor'
      });
    });
  });

  describe('persistFormState', () => {
    it('should update the URL with form data', () => {
      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John',
        last_name: 'Doe'
      };

      urlStateManager.persistFormState(formData);

      expect(mockPushState).toHaveBeenCalledWith(
        formData,
        '',
        '/form?date=2025-01-01&first_name=John&last_name=Doe'
      );
    });

    it('should handle special characters in URL update', () => {
      const formData: UserFormData = {
        date: '2025-01-01',
        first_name: 'John & Jane',
        last_name: 'O\'Connor'
      };

      urlStateManager.persistFormState(formData);

      expect(mockPushState).toHaveBeenCalledWith(
        formData,
        '',
        '/form?date=2025-01-01&first_name=John+%26+Jane&last_name=O%27Connor'
      );
    });
  });
});