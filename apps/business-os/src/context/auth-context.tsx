'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, {
  clearClientSession,
  getStoredClientToken,
  storeClientToken,
} from '@/lib/api';
import { AuthUser } from '@/lib/types';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getStoredClientToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<AuthUser>('/auth/me');
      setUser(response.data);
    } catch {
      clearClientSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{ accessToken: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });

    storeClientToken(response.data.accessToken);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(() => {
    clearClientSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

