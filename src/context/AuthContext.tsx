import React, { createContext, useContext, useState } from 'react';

type User = {
  phone: string;
  pin: string;
};

type AuthContextValue = {
  isLoggedIn: boolean;
  user: User | null;
  login: (phone: string, pin: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string, pin: string) => {
    setIsLoggedIn(true);
    setUser({ phone, pin });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const value: AuthContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
