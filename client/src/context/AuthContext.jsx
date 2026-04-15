import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useI18n } from './I18nContext';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { t } = useI18n();
  const { success, error: showError } = useNotification();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alsalahy_user')); }
    catch { return null; }
  });

  const isLoggedIn = !!user;

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setUser(data.user);
      localStorage.setItem('alsalahy_user', JSON.stringify(data.user));
      localStorage.setItem('alsalahy_token', data.token);
      success(t('notif_login_success'));
      return true;
    } catch (err) {
      showError(t('notif_login_error'));
      return false;
    }
  }, [t, success, showError]);

  const register = useCallback(async (name, email, phone, password) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });
      setUser(data.user);
      localStorage.setItem('alsalahy_user', JSON.stringify(data.user));
      localStorage.setItem('alsalahy_token', data.token);
      success(t('notif_register_success'));
      return true;
    } catch (err) {
      showError(t('notif_register_error'));
      return false;
    }
  }, [t, success, showError]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/google', { method: 'POST' });
      setUser(data.user);
      localStorage.setItem('alsalahy_user', JSON.stringify(data.user));
      localStorage.setItem('alsalahy_token', data.token);
      success(t('notif_login_success'));
      return true;
    } catch (err) {
      showError('Google login failed');
      return false;
    }
  }, [t, success, showError]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('alsalahy_user');
    localStorage.removeItem('alsalahy_token');
    success(t('notif_logout_success'));
  }, [t, success]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
