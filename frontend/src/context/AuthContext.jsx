import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEMO_PERSONAS = [
  {
    name: 'Adv. Aarav Sharma',
    email: 'aarav.sharma@caseiq.legal',
    role: 'Lawyer',
    org: 'Supreme Court Bar Association'
  },
  {
    name: 'Priya Narayanan',
    email: 'priya.law@nludelhi.ac.in',
    role: 'Student',
    org: 'National Law University, Delhi'
  },
  {
    name: 'Dr. Vikramaditya Sen',
    email: 'vikram.sen@legalresearch.org',
    role: 'Researcher',
    org: 'Centre for Policy & Law Research'
  },
  {
    name: 'Shardul Amarchand & Partners',
    email: 'contact@shardul-law.in',
    role: 'Law Firm',
    org: 'Corporate Practice Group'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('caseiq_token') || null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('caseiq_theme') || 'dark');

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('caseiq_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Load user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          // Set default demo user if server reachable or fallback
          loginAsDemo(DEMO_PERSONAS[0].email);
        }
      } else {
        // Auto-login as primary lawyer persona for seamless instant demo
        loginAsDemo(DEMO_PERSONAS[0].email);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('caseiq_token', res.token);
        setToken(res.token);
        setUser(res.user);
        addToast(`Welcome back, ${res.user.name} (${res.user.role})!`, 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const loginAsDemo = async (email) => {
    try {
      const res = await api.login({ email, password: 'password123' });
      if (res.success) {
        localStorage.setItem('caseiq_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      console.warn('Demo login API fallback:', err);
      // Fallback local demo profile
      const persona = DEMO_PERSONAS.find(p => p.email === email) || DEMO_PERSONAS[0];
      setUser({
        id: 'user-demo',
        name: persona.name,
        email: persona.email,
        role: persona.role,
        organization: persona.org,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bookmarks: ['sec-bns-103', 'case-puttaswamy', 'map-1']
      });
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('caseiq_token', res.token);
        setToken(res.token);
        setUser(res.user);
        addToast(`Account created! Welcome, ${res.user.name}`, 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('caseiq_token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  const toggleBookmark = async (itemId) => {
    if (!user) {
      addToast('Please login to bookmark items', 'warning');
      return false;
    }
    try {
      const res = await api.toggleBookmark(itemId);
      if (res.success) {
        setUser(prev => ({ ...prev, bookmarks: res.bookmarks }));
        addToast(res.bookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks', 'success');
        return res.bookmarked;
      }
    } catch (err) {
      // Local fallback
      setUser(prev => {
        const bookmarks = prev.bookmarks || [];
        const exists = bookmarks.includes(itemId);
        const updated = exists ? bookmarks.filter(b => b !== itemId) : [...bookmarks, itemId];
        addToast(!exists ? 'Saved to bookmarks' : 'Removed from bookmarks', 'success');
        return { ...prev, bookmarks: updated };
      });
    }
  };

  const isBookmarked = (itemId) => {
    return user && user.bookmarks ? user.bookmarks.includes(itemId) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      loginAsDemo,
      demoPersonas: DEMO_PERSONAS,
      toggleBookmark,
      isBookmarked,
      toasts,
      addToast,
      removeToast,
      theme,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
