import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';

/**
 * Unauthorized page displayed when a user tries to access a route they don't have permission for
 */
const Unauthorized = () => {
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
        <ShieldAlert className="h-24 w-24 text-red-500 mb-6" />
        
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
