import React from 'react';
import { Link } from 'react-router-dom';
import { PrecedentStatus } from './PrecedentStatus';
import { GitFork, ArrowRight, Gavel } from 'lucide-react';

export const RelatedPrecedents = ({ precedents = [] }) => {
  if (!precedents || precedents.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <GitFork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold">
            Associated Judicial Precedents & Interpretations
          </h2>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">Related Landmark Decisions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {precedents.map((prec, idx) => {
          const caseId = prec.caseId || prec.id || `case-${idx + 1}`;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <PrecedentStatus status={prec.status || prec.relationshipType || 'Followed'} />
                  {prec.court && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {prec.court}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {prec.caseName}
                  </p>
                  {prec.citation && (
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {prec.citation}
                    </p>
                  )}
                  {prec.relevance && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {prec.relevance}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end">
                <Link
                  to={`/case/${caseId}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>View Case</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPrecedents;
