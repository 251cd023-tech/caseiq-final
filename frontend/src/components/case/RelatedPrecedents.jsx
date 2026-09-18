import React from 'react';
import { Link } from 'react-router-dom';
import { PrecedentStatus } from './PrecedentStatus';
import { GitFork, ArrowRight, Scale, Info } from 'lucide-react';

export const RelatedPrecedents = ({ relationships = [], currentCaseId }) => {
  if (!relationships || relationships.length === 0) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <GitFork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Precedent Relationships
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          No precedent relationships recorded for this case in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <GitFork className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Related Precedent Relationships ({relationships.length})
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Doctrinal links & judicial treatments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relationships.map((rel, idx) => {
          // Identify whether current case is source or target
          const isSource = rel.sourceCaseId === currentCaseId;
          const relatedCaseName = isSource ? rel.targetCaseName : rel.sourceCaseName;
          const targetId = isSource ? rel.targetCaseId : rel.sourceCaseId;

          return (
            <div
              key={rel.id || idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <PrecedentStatus status={rel.relationshipType} />
                  {rel.citation && (
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                      {rel.citation}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {relatedCaseName}
                  </p>
                  {rel.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                      {rel.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end">
                {targetId ? (
                  <Link
                    to={`/case/${targetId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>View Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">Cited Precedent</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPrecedents;
