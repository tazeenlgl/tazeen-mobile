import React, { createContext, useContext } from 'react';
import { usePersistedState } from '../utils/storage';

type User = {
  phone: string;
  pin: string;
};

type AuthContextValue = {
  isLoggedIn: boolean;
  // False until the saved session has been read from the device.
  ready: boolean;
  user: User | null;
  login: (phone: string, pin: string) => void;
  logout: () => void;
  updatePhone: (phone: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn, loggedHydrated] = usePersistedState('loggedIn', false);
  const [user, setUser, userHydrated] = usePersistedState<User | null>('user', null);
  const ready = loggedHydrated && userHydrated;

  const login = (phone: string, pin: string) => {
    setIsLoggedIn(true);
    setUser({ phone, pin });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const updatePhone = (phone: string) => {
    setUser(current => (current ? { ...current, phone } : current));
  };

  const value: AuthContextValue = {
    isLoggedIn,
    ready,
    user,
    login,
    logout,
    updatePhone,
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
