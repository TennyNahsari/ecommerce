import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('digi_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Error loading user auth state:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const result = await apiService.login(username, password);
    if (result.success) {
      setUser(result.user);
      try {
        await AsyncStorage.setItem('digi_token', result.token);
        await AsyncStorage.setItem('digi_user', JSON.stringify(result.user));
      } catch (e) {}
    }
    return result;
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('digi_token');
      await AsyncStorage.removeItem('digi_user');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
