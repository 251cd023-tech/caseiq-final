import React from 'react';
import { BookOpen, AlertTriangle, ShieldX, Clock } from 'lucide-react';

export const OldLawCard = ({ mapping }) => {
  if (!mapping) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Old Law (Historical)</span>
          </span>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
            Repealed
          </span>
        </div>

        {/* Act & Section */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {mapping.oldAct}
          </p>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {mapping.oldSection}: {mapping.oldTitle}
          </h3>
        </div>

        {/* Provision Text */}
        {mapping.oldProvision && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Statutory Provision Text
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-950/70 border border-amber-100 dark:border-amber-900/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
              {mapping.oldProvision}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Scope */}
      <div className="pt-3 border-t border-amber-100 dark:border-amber-900/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-medium">
        <span>Pre-July 2024 Legal Standard</span>
        <span>Historical Reference Only</span>
      </div>
    </div>
  );
};

export default OldLawCard;
