import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, ArrowUpRight } from 'lucide-react';

export const PrecedentStatus = ({ status, className = '' }) => {
  const normalizedStatus = (status || '').toLowerCase().trim();

  let badgeStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
  let Icon = ArrowUpRight;
  let label = status || 'Referenced';

  if (normalizedStatus.includes('follow')) {
    badgeStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
    Icon = CheckCircle2;
    label = 'Followed';
  } else if (normalizedStatus.includes('overrule')) {
    badgeStyle = 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
    Icon = XCircle;
    label = 'Overruled';
  } else if (normalizedStatus.includes('distinguish')) {
    badgeStyle = 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
    Icon = AlertTriangle;
    label = 'Distinguished';
  } else if (normalizedStatus.includes('refer')) {
    badgeStyle = 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
    Icon = HelpCircle;
    label = 'Referred';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${badgeStyle} ${className}`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </span>
  );
};

export default PrecedentStatus;
