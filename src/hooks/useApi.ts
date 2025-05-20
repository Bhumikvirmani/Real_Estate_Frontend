import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

/**
 * Configuration for API requests
 */
interface ApiRequest {
  /** API endpoint path or full URL */
  url: string;
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method?: string;
  /** Request body (will be JSON stringified) */
  body?: any;
  /** Whether authentication is required for this request */
  requireAuth?: boolean;
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
  /** Whether to show error toast notifications */
  showErrorToast?: boolean;
  /** Whether to use fallback/demo data if the request fails */
  useFallback?: boolean;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Custom hook for making API requests with consistent error handling and loading states
 */
export const useApi = <T = any>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  /**
   * Get the API base URL from environment variables or use the production URL
   */
  const getApiBaseUrl = useCallback(() => {
    // Try environment variable first
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Use production URL as fallback
    return 'https://real-estate-api.lovable.app';
  }, []);

  /**
   * Make an API request with the provided configuration
   */
  const fetchData = useCallback(async ({
    url,
    method = 'GET',
    body,
    requireAuth = false,
    headers = {},
    showErrorToast = true,
    useFallback = true,
    timeoutMs = 8000
  }: ApiRequest) => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = getApiBaseUrl();
      // Check if the URL contains 'undefined' or 'null' as a parameter
      if (url.includes('/undefined') || url.includes('/null') || url.includes('=undefined') || url.includes('=null')) {
        throw new Error('Invalid request: URL contains undefined or null parameters');
      }

      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

      // Get authentication token if required
      const token = localStorage.getItem('token');

      // Prepare headers with content type and auth token if needed
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      if (requireAuth) {
        if (!token) {
          throw new Error('Authentication required');
        }
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      // Set up request timeout with AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      try {
        // Make the API request
        const response = await fetch(fullUrl, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Try to parse the response as JSON
        const responseData = await response.json().catch(() => ({}));

        // Handle error responses
        if (!response.ok) {
          throw new Error(responseData.message || `Request failed with status ${response.status}`);
        }

        // Update state with successful response
        setData(responseData);
        return responseData;
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (err: any) {
      // Handle different types of errors
      const isAbortError = err.name === 'AbortError';
      const errorMsg = isAbortError
        ? 'Request timed out'
        : err.message || 'An unknown error occurred';

      console.error(`API Error: ${errorMsg}`, err);
      setError(new Error(errorMsg));

      // Show error toast if enabled
      if (showErrorToast) {
        toast({
          variant: "destructive",
          title: "API Error",
          description: isAbortError
            ? "Request timed out. Please try again."
            : errorMsg
        });
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, getApiBaseUrl]);

  /**
   * Reset the hook state (clear data, error, and loading state)
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    reset,
    getApiBaseUrl
  };
};
