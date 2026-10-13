import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tod_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('tod_token')) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error('Session verification error:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const { token: newToken, user: newUser, profile: newProfile } = res.data;
      localStorage.setItem('tod_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setProfile(newProfile);
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data && res.data.success) {
      const { token: newToken, user: newUser, profile: newProfile } = res.data;
      localStorage.setItem('tod_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setProfile(newProfile);
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    localStorage.removeItem('tod_token');
    localStorage.removeItem('tod_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      token,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
      login,
      register,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
