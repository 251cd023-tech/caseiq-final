import React from 'react';
import { Scale, HelpCircle, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const KeyPrinciples = ({ analysis }) => {
  if (!analysis) return null;

  const { issues, arguments: caseArgs, reasoning, decision } = analysis;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Scale className="w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Legal Issues & Core Arguments
        </h2>
      </div>

      {/* Issues Framed */}
      {issues && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Constitutional & Legal Questions Framed</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {issues}
          </div>
        </div>
      )}

      {/* Arguments: Petitioner vs Respondent */}
      {caseArgs && (caseArgs.petitioner || caseArgs.respondent) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseArgs.petitioner && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <UserCheck className="w-4 h-4" />
                <span>Petitioner / Appellant Submissions</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseArgs.petitioner}
              </p>
            </div>
          )}

          {caseArgs.respondent && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Respondent / State Defense</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {caseArgs.respondent}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Ratio Decidendi / Legal Reasoning */}
      {reasoning && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Ratio Decidendi & Legal Principles Established</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-medium">
            {reasoning}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyPrinciples;
