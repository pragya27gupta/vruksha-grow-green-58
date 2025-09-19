import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'processor' | 'laboratory' | 'manufacturer' | 'regulator' | 'consumer';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole, name?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vrukshachain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call - in real app, this would validate against backend
    const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    // For demo purposes, allow any login with demo credentials
    if (email === 'demo@vrukshachain.com' && password === 'demo123') {
      const userData = {
        id: 'demo-' + role,
        email,
        role,
        name: 'Demo User'
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const signup = async (email: string, password: string, role: UserRole, name?: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('vrukshachain_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        role,
        name: name || email.split('@')[0]
      };

      users.push(newUser);
      localStorage.setItem('vrukshachain_users', JSON.stringify(users));

      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      };
      setUser(userData);
      localStorage.setItem('vrukshachain_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vrukshachain_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};