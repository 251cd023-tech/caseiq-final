import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, Trash2, ArrowRight, Gavel, Calendar, Loader2 } from 'lucide-react';

export const SavedCases = ({ cases = [], loading = false, onRemoveCase }) => {
  const { toggleBookmark, addToast } = useAuth();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (caseId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setRemovingId(caseId);
    try {
      await toggleBookmark(caseId);
      if (onRemoveCase) onRemoveCase(caseId);
    } catch (err) {
      addToast('Failed to remove case from saved list', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Saved Landmark Cases
          </h2>
        </div>
        <Link
          to="/saved"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          View All ({cases.length})
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading saved judgments...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          No saved cases yet. Bookmark any case from Search or Landmark Precedents to pin it here.
        </div>
      ) : (
        <div className="space-y-2.5">
          {cases.slice(0, 4).map((c) => {
            const caseId = c.id || `case-${c.numericId}`;
            const isRemoving = removingId === caseId;

            return (
              <div
                key={caseId}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 flex items-center justify-between gap-3 transition-all"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                      {c.court || 'Supreme Court'}
                    </span>
                    {c.year && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {c.year}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/case/${caseId}`}
                    className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                  >
                    {c.caseName || c.title}
                  </Link>
                  {c.citation && (
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {c.citation}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    to={`/case/${caseId}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    View Case
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(caseId, e)}
                    disabled={isRemoving}
                    aria-label={`Remove saved case ${c.caseName || ''}`}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Remove Saved Case"
                  >
                    {isRemoving ? <Loader2 className="w-4 h-4 animate-spin text-rose-500" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedCases;
