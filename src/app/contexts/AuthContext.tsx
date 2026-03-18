import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { initialUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'role'>) => boolean;
  updateProfile: (userId: string, data: Partial<User>) => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('snackshop_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('snackshop_users', JSON.stringify(initialUsers));
    }

    const storedCurrentUser = localStorage.getItem('snackshop_current_user');
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Save users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('snackshop_users', JSON.stringify(users));
    }
  }, [users]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('snackshop_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('snackshop_current_user');
  };

  const register = (userData: Omit<User, 'id' | 'createdAt' | 'role'>): boolean => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('snackshop_current_user', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser?.id === userId) {
      const updatedUser = { ...currentUser, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('snackshop_current_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    currentUser,
    users,
    login,
    logout,
    register,
    updateProfile,
    isAdmin: currentUser?.role === 'admin',
    isAuthenticated: currentUser !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
