
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = '/api/auth';

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, '_id'> & { password?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      throw new Error(data.message || 'Login failed');
    }
    setIsLoading(false);
  };

  const signup = async (userData: Omit<User, '_id'> & { password?: string }) => {
    setIsLoading(true);
    const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
        setUser(data.user);
    } else {
        throw new Error(data.message || 'Signup failed');
    }
    setIsLoading(false);
  };

  const logout = async () => {
    await fetch(`${API_URL}/logout`, { credentials: 'include' });
    setUser(null);
    router.push('/');
  };

  const updateUser = async (userData: Partial<User>) => {
    // This is a mock update for the frontend state.
    // In a real app, you would have a backend endpoint to update user data.
    if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
