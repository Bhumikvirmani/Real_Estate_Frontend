/**
 * Utility functions for debugging API connections
 */

/**
 * Tests the CORS connection to the backend API
 * @returns Promise with the test result
 */
export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Get the API URL from environment variables or use the production URL as fallback
    const apiUrl = import.meta.env.VITE_API_URL || 'https://real-estate-backend-bq2m.onrender.com';

    // Make a request to the CORS test endpoint
    const response = await fetch(`${apiUrl}/api/cors-test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // Removed custom header that was causing CORS issues
      }
    });

    if (!response.ok) {
      return {
        success: false,
        message: `API connection failed with status: ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: 'API connection successful',
      details: data
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: { error }
    };
  }
};

/**
 * Logs the current API configuration
 */
export const logApiConfig = (): void => {
  console.log('API Configuration:');
  console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL || '(not set)');
  console.log('- Environment:', import.meta.env.MODE);
  console.log('- Production:', import.meta.env.PROD);
  console.log('- Development:', import.meta.env.DEV);
};
