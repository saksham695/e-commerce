import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/interfaces';
import { UserRole } from '../types/enums';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create user based on role
    const newUser: User = {
      id: uuidv4(),
      email,
      name: email.split('@')[0],
      role,
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
