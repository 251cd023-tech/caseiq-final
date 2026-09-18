import React from 'react';
import { ArrowRight, ArrowRightLeft, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export const LawRelationship = ({ mapping }) => {
  if (!mapping) return null;

  const relationshipType = mapping.relationshipType || 'Replaced & Modernized by';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Statutory Reform Concordance
        </span>
        {mapping.category && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            {mapping.category}
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
        {/* Old Law Node */}
        <div className="flex-1 text-center md:text-left space-y-1">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
            Predecessor Statute (Repealed)
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {mapping.oldAct?.split(',')[0]} {mapping.oldSection}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {mapping.oldTitle}
          </p>
        </div>

        {/* Relationship Chain Badge */}
        <div className="flex flex-col items-center gap-1.5 px-4 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-600/20">
            <span>{relationshipType}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Effective 1 July 2024</span>
        </div>

        {/* New Law Node */}
        <div className="flex-1 text-center md:text-right space-y-1">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
            New Enacted Statute (In Force)
          </span>
          <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
            {mapping.newAct?.split(',')[0]} {mapping.newSection}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {mapping.newTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawRelationship;
