import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Scale, 
  Search, 
  Sun, 
  Moon, 
  User, 
  ChevronDown, 
  Sparkles, 
  Bookmark, 
  LogOut, 
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export const Navbar = ({ onSearchTrigger, onTabChange, onOpenAuth }) => {
  const { user, logout, demoPersonas, loginAsDemo, theme, toggleTheme } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      onSearchTrigger(quickQuery.trim());
      setQuickQuery('');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Lawyer': return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
      case 'Student': return <GraduationCap className="w-3.5 h-3.5 text-sky-400" />;
      case 'Researcher': return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'Law Firm': return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <User className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Lawyer': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Student': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Researcher': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Law Firm': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">CaseIQ</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">AI Legal</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Intelligent Indian Legal Research Platform</p>
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <form onSubmit={handleQuickSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Search laws, sections, cases, or ask a legal question..."
              className="w-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-24 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Ask AI</span>
              <Sparkles className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Right Tools & User Persona Selector */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Persona / User Switcher */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white line-clamp-1">{user.name}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 ml-1 transition-transform" />
                </button>

                {showPersonaMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 space-y-3">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">{user.organization}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-2">Switch Demo Persona</p>
                      {demoPersonas.map(persona => (
                        <button
                          key={persona.email}
                          onClick={() => {
                            loginAsDemo(persona.email);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${user.email === persona.email ? 'bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        >
                          <div>
                            <span className="font-semibold block text-slate-900 dark:text-slate-100">{persona.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{persona.org}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(persona.role)}`}>
                            {persona.role}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onTabChange('saved');
                          setShowPersonaMenu(false);
                        }}
                        className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Saved Cases ({user.bookmarks ? user.bookmarks.length : 0})</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowPersonaMenu(false);
                          onTabChange('login');
                        }}
                        className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTabChange('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onTabChange('register')}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
