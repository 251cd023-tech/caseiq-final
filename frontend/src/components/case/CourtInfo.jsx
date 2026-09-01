import React from 'react';
import { Gavel, Calendar, Users, ExternalLink, ShieldCheck, Building, BookCheck } from 'lucide-react';

export const CourtInfo = ({ caseData }) => {
  if (!caseData) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Judicial & Citation Metadata
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Court */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Adjudicating Court</p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{caseData.court || 'Supreme Court of India'}</p>
        </div>

        {/* Date */}
        {caseData.judgmentDate && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Judgment Date</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{caseData.judgmentDate}</p>
          </div>
        )}

        {/* Citation */}
        {caseData.citation && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Law Report Citation</p>
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">{caseData.citation}</p>
          </div>
        )}
      </div>

      {/* Bench Detail */}
      {caseData.bench && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bench Composition</p>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{caseData.bench}</p>
        </div>
      )}

      {/* Official Source & Verification Link */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{caseData.source || 'Supreme Court Reports / Neutral Citation Repository'}</span>
        </div>

        {caseData.sourceUrl && (
          <a
            href={caseData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 transition-colors"
          >
            <span>View Official Judgment Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default CourtInfo;
