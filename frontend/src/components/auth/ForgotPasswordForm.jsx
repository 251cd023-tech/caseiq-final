import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [touched, setTouched] = useState(false);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isEmailValid = email.trim() !== '' && validateEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isEmailValid || loading) return;

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await api.requestPasswordReset(email.trim());
      if (res && res.success) {
        setSuccessMessage(res.message || 'Password reset link has been dispatched to your email address.');
      } else {
        setError(res?.message || 'Reset service unavailable.');
      }
    } catch (err) {
      // Per spec: If backend has no reset endpoint, show "Reset service unavailable." Never fake a reset-success response.
      setError(err.message || 'Reset service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-800 dark:text-amber-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="font-semibold">Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          <div className="flex-1">
            <p className="font-semibold">Reset Link Sent</p>
            <p className="mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reset-email">
            Account Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
                if (successMessage) setSuccessMessage('');
              }}
              onBlur={() => setTouched(true)}
              placeholder="e.g. advocate@caseiq.legal"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched && !isEmailValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched && !isEmailValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Please enter a valid email address</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isEmailValid || loading}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            !isEmailValid || loading
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Requesting reset...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Password Reset Link</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Log In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
