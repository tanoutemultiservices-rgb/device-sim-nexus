import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersApi } from '@/services/api';

interface User {
  ID: string;
  USERNAME: string;
  NOM: string;
  PRENOM: string;
  TEL: string;
  EMAIL: string;
  PASSWORD: string;
  STATUS: string;
  BALANCE: number;
  DEVICE: string;
  ROLE: 'ADMIN' | 'EXECUTOR' | 'CUSTOMER' | 'CUSTMER'; // CUSTMER is a database typo
}

interface AuthContextType {
  user: User | null;
  login: (userId: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
  isExecutor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      loadUser(storedUserId);
    }
  }, []);

  const loadUser = async (userId: string) => {
    try {
      const users = await usersApi.getAll() as any[];
      const foundUser = users.find((u: any) => u.ID === userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('userId');
    }
  };

  const login = async (userId: string) => {
    try {
      const users = await usersApi.getAll() as any[];
      const foundUser = users.find((u: any) => u.ID === userId);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('userId', userId);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.ROLE === 'ADMIN',
        isCustomer: user?.ROLE === 'CUSTOMER',
        isExecutor: user?.ROLE === 'EXECUTOR',
      }}
    >
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
