import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginForm = ({ onSuccess }) => {
  const { login, loginAsDemo, demoPersonas } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isEmailValid = email.trim() !== '' && validateEmail(email);
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid || loading) return;

    setError('');
    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (res && res.success) {
        if (onSuccess) onSuccess();
        const origin = location.state?.from?.pathname || '/dashboard';
        navigate(origin, { replace: true });
      } else {
        setError(res?.message || 'Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemo(demoEmail);
      if (onSuccess) onSuccess();
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (err) {
      setError('Failed to log in with demo persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="login-email">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              placeholder="e.g. advocate@caseiq.legal"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.email && !isEmailValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.email && !isEmailValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              {email.trim() === '' ? 'Email is required' : 'Please enter a valid email address'}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="login-password">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.password && !isPasswordValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.password && !isPasswordValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Password is required</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            !isFormValid || loading
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Access Pills */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
          Instant Demo Sign-In
        </p>
        <div className="grid grid-cols-2 gap-2">
          {demoPersonas.slice(0, 4).map((p) => (
            <button
              key={p.email}
              type="button"
              onClick={() => handleDemoSelect(p.email)}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {p.role}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{p.org}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Register Prompt */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
