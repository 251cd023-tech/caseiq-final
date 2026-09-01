import React, { useState } from 'react';
import { SaveCaseButton } from './SaveCaseButton';
import { Gavel, Calendar, Users, Copy, Check, Scale, BookOpen, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CaseHeader = ({ caseData }) => {
  const { addToast } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!caseData) return null;

  const handleCopyCitation = () => {
    if (caseData.citation) {
      navigator.clipboard.writeText(caseData.citation);
      setCopied(true);
      addToast('Citation copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-3 max-w-4xl">
          {/* Badge Hierarchy */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Gavel className="w-3.5 h-3.5" />
              <span>{caseData.court || 'Supreme Court of India'}</span>
            </span>
            {caseData.judgmentDate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{caseData.judgmentDate}</span>
              </span>
            )}
            {caseData.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                Official Gazette Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {caseData.caseName || caseData.title}
          </h1>

          {/* Citation & Copy */}
          {caseData.citation && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {caseData.citation}
              </span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>
          )}

          {/* Bench / Judges */}
          {caseData.bench && (
            <div className="flex items-start gap-2 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">Bench: </strong>
                {caseData.bench}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
          <SaveCaseButton caseId={caseData.id} />
        </div>
      </div>

      {/* Legal Topics Pills */}
      {caseData.legalTopics && caseData.legalTopics.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Core Legal Subjects & Doctrines
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {caseData.legalTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseHeader;
