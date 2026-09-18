import React from 'react';
import { FileText, Layers } from 'lucide-react';

export const CaseFacts = ({ facts }) => {
  if (!facts) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <FileText className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Material Case Facts
        </h2>
      </div>

      <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 whitespace-pre-line">
        {facts}
      </div>
    </div>
  );
};

export default CaseFacts;
