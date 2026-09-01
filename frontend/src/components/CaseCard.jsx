import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gavel, Bookmark, BookmarkCheck, BrainCircuit, ExternalLink, Calendar, Users, Scale, ArrowRight } from 'lucide-react';

export const CaseCard = ({
  caseData,
  onAnalyze,
  onOpenMap,
  className = ''
}) => {
  const { toggleBookmark, isBookmarked } = useAuth();
  const navigate = useNavigate();

  if (!caseData) return null;

  const caseId = caseData.id || `case-${caseData.numericId}`;
  const isSaved = isBookmarked(caseId);

  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark(caseId);
  };

  const handleAnalyzeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onAnalyze) {
      onAnalyze(caseData);
    } else {
      navigate('/ai-analysis');
    }
  };

  return (
    <div
      className={`group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 p-5 transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-4 ${className}`}
    >
      <div className="space-y-3">
        {/* Top Meta Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <Gavel className="w-3 h-3" />
              <span>{caseData.court || 'Supreme Court of India'}</span>
            </span>
            {caseData.year && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{caseData.year}</span>
              </span>
            )}
            {caseData.relevanceScore && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                {Math.round(parseFloat(caseData.relevanceScore) * 100)}% Match
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            aria-label={isSaved ? 'Remove case from bookmarks' : 'Save case to bookmarks'}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isSaved
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Case Title & Citation */}
        <div>
          <Link
            to={`/case/${caseId}`}
            className="block text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {caseData.caseName || caseData.title}
          </Link>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            {caseData.citation}
          </p>
        </div>

        {/* Bench Info */}
        {caseData.bench && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{caseData.bench}</span>
          </div>
        )}

        {/* Snippet / Key Holding */}
        {(caseData.snippet || caseData.keyHolding || caseData.analysis?.decision) && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
            {caseData.snippet || caseData.keyHolding || caseData.analysis?.decision}
          </p>
        )}

        {/* Legal Topics */}
        {caseData.legalTopics && caseData.legalTopics.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {caseData.legalTopics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"
              >
                {topic}
              </span>
            ))}
            {caseData.legalTopics.length > 4 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                +{caseData.legalTopics.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
        <button
          type="button"
          onClick={handleAnalyzeClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 transition-colors cursor-pointer"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI 5-Pillar Analysis</span>
        </button>

        <Link
          to={`/case/${caseId}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
        >
          <span>View Case</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CaseCard;
