
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // This is a mock login. In a real app, you would validate against a backend.
    try {
      // Mock validation: check if a user with this email exists in mock local storage users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email);

      if (existingUser) {
        // Mock password check - in a real app, this is insecure.
        // This is for demonstration purposes only.
        if (existingUser.password === password) {
          const userToSave = { ...existingUser };
          delete userToSave.password; // Don't store password in the user object
          setUser(userToSave);
          localStorage.setItem('user', JSON.stringify(userToSave));
          setIsLoading(false);
          return userToSave;
        }
      }
      throw new Error('Invalid email or password.');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (userData: Omit<User, '_id' | 'profileImageUrl' | 'password'> & { password?: string }) => {
    setIsLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === userData.email);

      if (existingUser) {
        throw new Error('An account with this email already exists.');
      }
      
      const newUser = {
        _id: `user_${Date.now()}`,
        ...userData
      };
      
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Don't log in automatically. The user will be redirected to the login page.
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
    router.refresh(); // Force a refresh to clear state in other components
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
