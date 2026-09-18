import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Statistics } from '../components/Statistics';
import { QuickActions } from '../components/QuickActions';
import { RecentSearches } from '../components/RecentSearches';
import { SavedCases } from '../components/SavedCases';
import { ResearchHistory } from '../components/ResearchHistory';
import { Scale, Sparkles, User, Briefcase, GraduationCap, Building2, Search } from 'lucide-react';

export const Dashboard = () => {
  const { user, loginAsDemo, demoPersonas } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedCases, setSavedCases] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, historyRes, savedRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getRecentSearches(),
        api.getSavedCases()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.stats);
      } else {
        // MOCK DATA: development fallback only. Not authoritative legal content.
        setStats({
          casesCount: 12,
          historyCount: 4,
          mappingsCount: 8,
          precedentsCount: 13,
          savedCount: (user?.bookmarks || []).length || 3
        });
      }

      if (historyRes.status === 'fulfilled' && historyRes.value?.success) {
        setRecentSearches(historyRes.value.history || []);
        setHistory(historyRes.value.history || []);
      }

      if (savedRes.status === 'fulfilled' && savedRes.value?.success) {
        setSavedCases(savedRes.value.cases || []);
      } else {
        // Fallback: resolve cases from getCases matching bookmarks
        try {
          const allCasesRes = await api.getCases();
          if (allCasesRes.success) {
            const userBookmarks = user?.bookmarks || ['case-puttaswamy', 'case-maneka'];
            const filtered = (allCasesRes.cases || []).filter(c => userBookmarks.includes(c.id));
            setSavedCases(filtered);
          }
        } catch {
          // MOCK DATA: development fallback only. Not authoritative legal content.
          setSavedCases([]);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRemoveSavedCase = (removedCaseId) => {
    setSavedCases(prev => prev.filter(c => (c.id || `case-${c.numericId}`) !== removedCaseId));
    setStats(prev => prev ? { ...prev, savedCount: Math.max(0, (prev.savedCount || 1) - 1) } : prev);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Legal Intelligence Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user ? `Welcome, ${user.name}` : 'CaseIQ Legal AI Platform'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Unified workspace for researching Indian penal statutes, Bharatiya Nyaya Sanhita reforms, and landmark constitutional precedents.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:w-80">
            <form onSubmit={handleQuickSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases or acts..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 1. Statistics Cards */}
      <Statistics stats={stats} loading={loading} />

      {/* 2. Quick Actions Portals */}
      <QuickActions />

      {/* 3. Grid: Recent Searches & Saved Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSearches
          searches={recentSearches}
          loading={loading}
        />
        <SavedCases
          cases={savedCases}
          loading={loading}
          onRemoveCase={handleRemoveSavedCase}
        />
      </div>

      {/* 4. Research History Timeline */}
      <ResearchHistory
        history={history}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
