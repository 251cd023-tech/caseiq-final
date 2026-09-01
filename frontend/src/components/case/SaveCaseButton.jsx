import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, BookmarkCheck, Loader2, AlertCircle } from 'lucide-react';

export const SaveCaseButton = ({ caseId, className = '', showLabel = true }) => {
  const { user, isBookmarked, toggleBookmark, addToast } = useAuth();
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'removing' | 'error'

  if (!caseId) return null;

  const isSaved = isBookmarked(caseId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please sign in to bookmark cases', 'warning');
      return;
    }

    const nextState = isSaved ? 'removing' : 'saving';
    setStatus(nextState);

    try {
      await toggleBookmark(caseId);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      addToast('Failed to update bookmark status', 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getButtonContent = () => {
    if (status === 'saving') {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {showLabel && <span>Saving...</span>}
        </>
      );
    }
    if (status === 'removing') {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
          {showLabel && <span>Removing...</span>}
        </>
      );
    }
    if (status === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4 text-rose-500" />
          {showLabel && <span>Retry Save</span>}
        </>
      );
    }
    if (isSaved) {
      return (
        <>
          <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          {showLabel && <span>Saved</span>}
        </>
      );
    }
    return (
      <>
        <Bookmark className="w-4 h-4" />
        {showLabel && <span>Save Case</span>}
      </>
    );
  };

  const buttonStyle = isSaved
    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-blue-200 dark:border-blue-500/40 hover:bg-blue-100 dark:hover:bg-blue-500/25'
    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'saving' || status === 'removing'}
      aria-label={isSaved ? 'Remove case from saved list' : 'Save case to repository'}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${buttonStyle} ${className}`}
    >
      {getButtonContent()}
    </button>
  );
};

export default SaveCaseButton;
