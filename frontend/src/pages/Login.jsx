import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { Scale, ShieldCheck, Sparkles } from 'lucide-react';

export const Login = () => {
  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 mb-2">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to CaseIQ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Sign in to access your Indian legal research repository, statutory mappings, and AI analysis.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl backdrop-blur-md">
        <LoginForm />
      </div>

      <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Encrypted Session</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Indian Legal AI</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
