
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
