import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bookmark,
  History,
  Search,
  BookOpen,
  Scale,
  GitBranch,
  Trash2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  RotateCcw
} from 'lucide-react';

export const BookmarksHistoryView = ({ onSearchQuery, onNavigateToSection, onNavigateToCase }) => {
  const { user, toggleBookmark, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'history'
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [bookmarkedSections, setBookmarkedSections] = useState([]);
  const [bookmarkedCases, setBookmarkedCases] = useState([]);
  const [bookmarkedMappings, setBookmarkedMappings] = useState([]);

  useEffect(() => {
    loadHistory();
    loadAllBookmarkedEntities();
  }, [user]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getSearchHistory();
      if (res.success) {
        setHistoryItems(res.history || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadAllBookmarkedEntities = async () => {
    try {
      const [casesRes, actsRes, mapsRes] = await Promise.all([
        api.getCases(),
        api.getActs(),
        api.getLawMappings()
      ]);

      const userBookmarks = user?.bookmarks || [];

      if (casesRes.success) {
        setBookmarkedCases(casesRes.cases.filter(c => userBookmarks.includes(c.id)));
      }
      if (mapsRes.success) {
        setBookmarkedMappings(mapsRes.mappings.filter(m => userBookmarks.includes(m.id)));
      }
    } catch (err) {
      console.error('Failed to resolve bookmarks:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Legal Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bookmarks & Search History
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Access your saved statutory provisions, landmark judgments, legal mappings, and trace previous AI search queries.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Bookmarks ({(user?.bookmarks || []).length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Search History ({historyItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          {(user?.bookmarks || []).length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Bookmarks Saved Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click the bookmark icon on any section, case, or reform mapping across the platform to save it to your personal repository.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bookmarked Cases */}
              {bookmarkedCases.map(c => (
                <div key={c.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        LANDMARK CASE
                      </span>
                      <button
                        onClick={() => toggleBookmark(c.id)}
                        className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white">{c.caseName}</h3>
                    <p className="text-xs font-mono text-slate-400">{c.citation}</p>
                    <p className="text-xs text-slate-300 line-clamp-2">{c.analysis?.decision}</p>
                  </div>

                  <button
                    onClick={() => onNavigateToCase && onNavigateToCase(c.id)}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Case Details</span>
                  </button>
                </div>
              ))}

              {/* Bookmarked Mappings */}
              {bookmarkedMappings.map(m => (
                <div key={m.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        REFORM MAPPING
                      </span>
                      <button
                        onClick={() => toggleBookmark(m.id)}
                        className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {m.oldAct.split(',')[0]} {m.oldSection} ➔ {m.newAct.split(',')[0]} {m.newSection}
                    </h3>
                    <p className="text-xs text-slate-300">{m.punishmentChange}</p>
                  </div>

                  <div className="text-[10px] font-mono text-purple-400 bg-purple-950/20 p-2 rounded-xl border border-purple-500/20">
                    💡 {m.notes}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading search history...</div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Search History</h3>
              <p className="text-xs text-slate-400">Your recent natural language legal searches will appear here.</p>
            </div>
          ) : (
            historyItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onSearchQuery && onSearchQuery(item.query)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      "{item.query}"
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Top Match: {item.topMatch} • Found {item.resultsCount} results
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <RotateCcw className="w-3.5 h-3.5 ml-2 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
