import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const RelevanceAnalysis = ({ analysis, relevanceText }) => {
  const text = relevanceText || analysis?.decision || analysis?.reasoning;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
        <Sparkles className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Relevance Analysis
        </h2>
      </div>

      {text ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
          <p className="font-medium">{text}</p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          Relevance analysis is not available for this case.
        </div>
      )}
    </div>
  );
};

export default RelevanceAnalysis;
