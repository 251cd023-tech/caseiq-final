import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, X, Lock, Mail, User, Building2, Briefcase, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, demoPersonas, loginAsDemo } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'demo'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Lawyer',
    organization: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) onClose();
    } else if (mode === 'register') {
      const res = await register(formData);
      if (res.success) onClose();
    }
    setSubmitting(false);
  };

  const handleSelectDemo = async (email) => {
    setSubmitting(true);
    await loginAsDemo(email);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 mb-1">
            <Scale className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' && 'Welcome to CaseIQ'}
            {mode === 'register' && 'Create Research Account'}
            {mode === 'demo' && 'Quick Persona Selection'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'demo' ? 'Test CaseIQ instantly with specialized legal user profiles' : 'AI-powered Legal Research and Precedent Intelligence'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${mode === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('demo')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${mode === 'demo' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-400 hover:text-indigo-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personas</span>
          </button>
        </div>

        {mode === 'demo' ? (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-400">Click any persona to log in instantly with real roles & saved bookmarks:</p>
            {demoPersonas.map(persona => (
              <button
                key={persona.email}
                onClick={() => handleSelectDemo(persona.email)}
                disabled={submitting}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-blue-300">{persona.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {persona.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{persona.org}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Adv. Rahul Verma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Role</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Lawyer">Lawyer / Advocate</option>
                      <option value="Student">Law Student</option>
                      <option value="Researcher">Legal Researcher</option>
                      <option value="Law Firm">Law Firm / Corporate</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Organization / College</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. High Court Bar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@lawpractice.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? 'Authenticating...' : (mode === 'login' ? 'Sign In to Workspace' : 'Create CaseIQ Account')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
