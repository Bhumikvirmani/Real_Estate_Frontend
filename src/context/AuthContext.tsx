import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<boolean>;
  logout: () => void;
}

// Demo user for offline development/testing
const DEMO_USER = {
  _id: 'demo-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user' as const,
  token: 'demo-token'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Get API base URL with fallback options
  const getApiBaseUrl = useCallback(() => {
    // Try environment variable first
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Use production URL as fallback
    return 'https://real-estate-api.lovable.app';
  }, []);

  // Enhanced fetch function with better error handling and timeout
  const fetchData = useCallback(async (url: string, options: RequestInit = {}, timeoutMs = 8000) => {
    const baseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Try to parse JSON response
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }, [token, getApiBaseUrl]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: string = 'user') => {
    try {
      setIsLoading(true);

      try {
        // Try connecting to the real API
        const data = await fetchData('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password, role })
        });

        if (data?.token && data?.user) {
          // Store both token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);

          toast({
            title: 'Welcome back!',
            description: `Successfully logged in as ${data.user.name}`,
          });

          return true;
        }

        throw new Error('Invalid response from server');
      } catch (error) {
        console.log("API login failed, checking for demo mode");

        // If real API fails, use demo user for offline development
        if (email === 'demo@example.com' && password === 'password') {
          const demoUser = {
            ...DEMO_USER,
            role: role || 'user'
          };

          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          localStorage.setItem('token', demoUser.token);
          setToken(demoUser.token);

          toast({
            title: "Demo login successful",
            description: `You're logged in with a demo account as a ${role}. API connection is unavailable.`
          });

          return true;
        }

        // Re-throw the error if not using demo mode
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Couldn't connect to the authentication server"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string, role: string = 'user') => {
    try {
      setIsLoading(true);

      try {
        // Try connecting to the real API
        const data = await fetchData('/api/users/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, phone, role })
        });

        if (data?.token && data?.user) {
          // Store both token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);

          toast({
            title: 'Welcome!',
            description: `Your account has been created successfully. Welcome to HomeHarbor, ${data.user.name}!`,
          });

          return true;
        }

        throw new Error('Invalid response from server');
      } catch (error) {
        console.log("API registration failed, using demo mode");

        // If real API fails, create a demo user with provided info
        const demoUser = {
          ...DEMO_USER,
          name,
          email,
          role: role || 'user'
        };

        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('token', demoUser.token);
        setToken(demoUser.token);

        toast({
          title: "Demo registration successful",
          description: `Created a demo account as a ${role}. API connection is unavailable.`
        });

        return true;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Couldn't connect to the registration server"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);

    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  }, [toast]);

  // Fetch user profile when token changes
  useEffect(() => {
    if (!token) return;

    setIsLoading(true);

    // Fetch user profile with the token
    fetchData('/api/users/profile')
      .then(data => {
        if (data) {
          setUser(data);
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          // If profile fetch fails, clear stored data
          logout();
        }
      })
      .catch(() => {
        // On error, clear auth data
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, fetchData, logout]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout
  }), [user, token, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the authentication context
 * @returns Authentication context with user data, token, and auth methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
