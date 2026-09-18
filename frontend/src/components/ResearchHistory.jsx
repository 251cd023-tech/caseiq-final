import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, ArrowRightLeft, BookOpen, BrainCircuit, Calendar, ChevronRight } from 'lucide-react';

export const ResearchHistory = ({ history = [], loading = false }) => {
  const navigate = useNavigate();

  const getEventIcon = (type) => {
    switch (type) {
      case 'mapping': return <ArrowRightLeft className="w-4 h-4 text-purple-500" />;
      case 'analysis': return <BrainCircuit className="w-4 h-4 text-emerald-500" />;
      case 'section': return <BookOpen className="w-4 h-4 text-blue-500" />;
      default: return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'Recent activity';
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent activity';
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Research Timeline & Activity
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">Session Audit</span>
      </div>

      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading research timeline...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          No recorded activity in this session.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {history.slice(0, 5).map((item, idx) => (
            <div key={item.id || idx} className="relative group">
              {/* Dot indicator */}
              <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-sm"></div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.query ? `Searched: "${item.query}"` : item.description || 'Legal Research Session'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                {item.topMatch && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    Matched: {item.topMatch}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchHistory;
