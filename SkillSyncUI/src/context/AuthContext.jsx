import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const stored = getStoredToken();
      if (stored) {
        try {
          const res = await authApi.getCurrentUser();
          if (res?.data) {
            setUser(res.data);
            setStoredUser(res.data);
          }
        } catch {
          // Token invalid or expired
          logout();
        }
      }
      setIsLoading(false);
    }
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res?.data) {
      const authData = res.data;
      setToken(authData.token);
      setStoredToken(authData.token);
      setUser(authData);
      setStoredUser(authData);
      return authData;
    }
    throw new Error('Authentication response invalid');
  };

  const register = async (fullName, email, password) => {
    const res = await authApi.register({ fullName, email, password });
    if (res?.data) {
      const authData = res.data;
      setToken(authData.token);
      setStoredToken(authData.token);
      setUser(authData);
      setStoredUser(authData);
      return authData;
    }
    throw new Error('Registration response invalid');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStoredToken(null);
    setStoredUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
