import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sanjaya_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true); // resolving stored token on mount

  // On mount — if a token exists, fetch the user profile to validate it
  useEffect(() => {
    const resolve = async () => {
      if (token) {
        try {
          const data = await api.me(token);
          if (data?.id) {
            setUser(data);
          } else {
            // Token invalid / expired
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
          }
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      }
      setLoading(false);
    };
    resolve();
  }, []); // run once on mount

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.detail) throw new Error(data.detail);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    const me = await api.me(data.access_token);
    setUser(me);
    return me;
  };

  const register = async (full_name, email, password) => {
    const data = await api.register({ full_name, email, password });
    if (data.detail) throw new Error(data.detail);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    const me = await api.me(data.access_token);
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
