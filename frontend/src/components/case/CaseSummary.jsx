import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const CaseSummary = ({ summary, holding, decision }) => {
  const content = summary || decision || holding;

  if (!content) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <BookOpen className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Case Executive Summary
        </h2>
      </div>

      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        {content}
      </p>
    </div>
  );
};

export default CaseSummary;
