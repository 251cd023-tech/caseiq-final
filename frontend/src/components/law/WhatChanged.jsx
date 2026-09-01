import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export const WhatChanged = ({ mapping }) => {
  if (!mapping) return null;

  const differences = mapping.importantDifferences || [];
  const punishmentChange = mapping.punishmentChange;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            What Changed? (Key Statutory & Jurisprudential Differences)
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">2024 Legal Reform Analysis</span>
      </div>

      {/* Punishment Change Callout */}
      {punishmentChange && (
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            <Scale className="w-4 h-4" />
            <span>Sentencing & Penalty Structural Changes</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {punishmentChange}
          </p>
        </div>
      )}

      {/* Important Differences Bullet List */}
      {differences.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Key Doctrinal & Procedural Modifications
          </p>
          <ul className="space-y-2.5">
            {differences.map((diff, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes / Legislative Intent */}
      {mapping.notes && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Legislative & Judicial Intent
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {mapping.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatChanged;
