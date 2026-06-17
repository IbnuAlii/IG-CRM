'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuthStore } from './store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { user, setUser, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, [setUser]);

  const login = async (identifier: string, password: string, role: string) => {
    // Mock authentication - in production, this would call an API
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        email: identifier.includes('@') ? identifier : undefined,
        phone: !identifier.includes('@') ? identifier : '',
        name: 'Demo User',
        role: role as any,
        city: 'New York',
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
