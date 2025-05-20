import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testApiConnection, logApiConfig } from '@/utils/apiDebug';

/**
 * Component for testing API connection
 * This is useful for debugging CORS issues between frontend and backend
 */
export function ApiConnectionTest() {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    details?: any;
    loading?: boolean;
  }>({});

  const handleTest = async () => {
    try {
      setResult({ loading: true });
      
      // Log API configuration to console
      logApiConfig();
      
      // Test the connection
      const testResult = await testApiConnection();
      
      setResult({
        ...testResult,
        loading: false
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Connection Test</CardTitle>
        <CardDescription>
          Test the connection between the frontend and backend to verify CORS configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result.loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
            <span>Testing connection...</span>
          </div>
        ) : result.success === undefined ? (
          <div className="text-center p-4 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-2" />
            <p>Click the button below to test the API connection</p>
          </div>
        ) : result.success ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connection Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              {result.message}
              {result.details && (
                <pre className="mt-2 p-2 bg-green-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              {result.message}
              {result.details && (
                <pre className="mt-2 p-2 bg-destructive/20 rounded text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTest} 
          className="w-full"
          disabled={result.loading}
        >
          {result.loading ? 'Testing...' : 'Test API Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
}
