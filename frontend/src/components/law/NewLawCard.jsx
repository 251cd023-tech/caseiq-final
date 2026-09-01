import React from 'react';
import { BookCheck, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const NewLawCard = ({ mapping }) => {
  if (!mapping) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-700/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>New Enacted Law (Current)</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
            In Force
          </span>
        </div>

        {/* Act & Section */}
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {mapping.newAct}
          </p>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {mapping.newSection}: {mapping.newTitle}
          </h3>
        </div>

        {/* Provision Text */}
        {mapping.newProvision && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              New Statutory Provision Text
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-slate-950/70 border border-emerald-100 dark:border-emerald-900/30 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
              {mapping.newProvision}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Scope */}
      <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-medium">
        <span>Bharatiya Nyaya Reform Architecture</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Statutory Standard</span>
        </span>
      </div>
    </div>
  );
};

export default NewLawCard;
