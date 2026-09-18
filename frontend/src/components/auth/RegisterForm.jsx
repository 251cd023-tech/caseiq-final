import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building, Briefcase, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Lawyer',
    organization: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isNameValid = formData.name.trim().length >= 2;
  const isEmailValid = validateEmail(formData.email.trim());
  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid = formData.confirmPassword === formData.password && formData.confirmPassword.length > 0;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    if (!isFormValid || loading) return;

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        organization: formData.organization.trim() || 'Independent Legal Practice',
        password: formData.password
      };

      const res = await register(payload);
      if (res && res.success) {
        if (onSuccess) onSuccess();
        navigate('/dashboard', { replace: true });
      } else {
        setError(res?.message || 'Registration failed. Please check your information and try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during registration.');
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
            <p className="font-semibold">Registration Error</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-name">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="reg-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Adv. Aarav Sharma"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.name && !isNameValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.name && !isNameValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Please enter your full name (minimum 2 characters)</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-email">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. advocate@caseiq.legal"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.email && !isEmailValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.email && !isEmailValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Please enter a valid email address</p>
          )}
        </div>

        {/* Role & Organization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-role">
              Professional Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <select
                id="reg-role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Lawyer">Advocate / Lawyer</option>
                <option value="Student">Law Student</option>
                <option value="Researcher">Legal Researcher</option>
                <option value="Law Firm">Law Firm Partner</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-org">
              Bar / Organization
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="reg-org"
                type="text"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                placeholder="e.g. High Court Bar"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-password">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="At least 6 characters"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.password && !isPasswordValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.password && !isPasswordValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Password must be at least 6 characters</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="reg-confirm-password">
            Confirm Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              id="reg-confirm-password"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border transition-all focus:outline-none focus:ring-2 ${
                touched.confirmPassword && !isConfirmPasswordValid
                  ? 'border-rose-400 dark:border-rose-600 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500`}
            />
          </div>
          {touched.confirmPassword && !isConfirmPasswordValid && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              {formData.confirmPassword ? 'Passwords do not match' : 'Please confirm your password'}
            </p>
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
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Login Prompt */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Already have a CaseIQ account?{' '}
          <Link
            to="/login"
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
