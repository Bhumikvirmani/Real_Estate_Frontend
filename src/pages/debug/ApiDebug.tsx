import React from 'react';
import { ApiConnectionTest } from '@/components/debug/ApiConnectionTest';

/**
 * Debug page for testing API connections
 * This page can be accessed at /debug/api to test CORS and API connectivity
 */
export default function ApiDebug() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">API Connection Debugging</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Environment</h2>
        <div className="bg-gray-100 p-4 rounded-md">
          <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
          <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Not set (will use fallback URL)'}</p>
          <p><strong>Fallback URL:</strong> https://real-estate-backend-bq2m.onrender.com</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        <ApiConnectionTest />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure the backend server is running and accessible</li>
          <li>Check that the CORS configuration in the backend includes your frontend domain</li>
          <li>Verify that the API URL in your environment variables is correct</li>
          <li>Check browser console for any CORS-related errors</li>
          <li>Try clearing your browser cache and cookies</li>
        </ul>
      </div>
    </div>
  );
}
