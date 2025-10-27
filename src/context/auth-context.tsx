
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = '/api'; // Use the proxied URL

// Define the User type based on your Mongoose model
interface User {
  _id: string;
  email: string;
  username: string;
  role: 'Designer' | 'Buyer' | 'Admin';
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  signup: (userData: Omit<User, '_id' | 'profileImageUrl'> & { password?: string }) => Promise<any>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUser(data.user);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, '_id' | 'profileImageUrl'> & { password?: string }) => {
    setIsLoading(true);
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Request failed with status ${res.status}`);
        }
        
        // After successful signup, log the user in to set the cookie
        await login(userData.email, userData.password || '');
        
        return data;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
        await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
    } catch (error) {
        console.error("Logout failed but proceeding with client-side cleanup", error)
    } finally {
        setUser(null);
        router.push('/');
        router.refresh();
        setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
        // In a real app, you would also make an API call to update the user in the database
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
