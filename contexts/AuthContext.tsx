import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  shopName: string;
  market: string;
  phone: string;
  cnic?: string;
}

interface LoginCredentials {
  phone: string;
  password?: string;
  userData?: Omit<User, 'phone'>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setPassword: (phone: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Simulate API call to verify credentials
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.userData) {
          // For sign up flow, use the provided user data
          setUser({
            id: Date.now().toString(),
            name: credentials.userData.name,
            shopName: credentials.userData.shopName,
            market: credentials.userData.market,
            phone: credentials.phone,
            cnic: credentials.userData.cnic,
          });
        } else {
          // For login flow, verify credentials and fetch user data from backend
          // This is mock data for now, but in real app would come from backend
          setUser({
            id: '1',
            name: 'John Doe',
            shopName: 'John\'s Shop',
            market: 'Central Market',
            phone: credentials.phone,
          });
        }
        resolve(true);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const setPassword = async (phone: string, password: string): Promise<void> => {
    // Simulate API call to set password
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, just resolve
        resolve();
      }, 1500);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        setPassword,
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