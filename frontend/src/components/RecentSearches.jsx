import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, ArrowUpRight, Clock, AlertCircle } from 'lucide-react';

export const RecentSearches = ({ searches = [], loading = false, error = null }) => {
  const navigate = useNavigate();

  const handleSearchClick = (query) => {
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recent';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Recent Legal Searches
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">Live AI Search Log</span>
      </div>

      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading search history...</p>
        </div>
      ) : error ? (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : searches.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          No recent searches found. Try searching a query above!
        </div>
      ) : (
        <div className="space-y-2">
          {searches.slice(0, 5).map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => handleSearchClick(item.query)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700/50 flex items-center justify-between gap-3 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {item.query}
                  </p>
                  {item.topMatch && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      Top Match: {item.topMatch}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.timestamp && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {formatTime(item.timestamp)}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
