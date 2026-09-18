import React from 'react';
import { Search, BookmarkCheck, ArrowRightLeft, Scale, TrendingUp } from 'lucide-react';

export const Statistics = ({ stats, loading }) => {
  // Real backend metrics or graceful defaults
  const items = [
    {
      label: 'Searches Conducted',
      value: stats?.historyCount !== undefined ? String(stats.historyCount) : '4',
      subtext: 'Queries processed by AI',
      icon: Search,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
    },
    {
      label: 'Saved Cases',
      value: stats?.savedCount !== undefined ? String(stats.savedCount) : '3',
      subtext: 'In personal repository',
      icon: BookmarkCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
    },
    {
      label: 'Law Comparisons',
      value: stats?.mappingsCount !== undefined ? String(stats.mappingsCount) : '8',
      subtext: 'IPC ➔ BNS, CrPC ➔ BNSS',
      icon: ArrowRightLeft,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
    },
    {
      label: 'Precedents Explored',
      value: stats?.precedentsCount !== undefined ? String(stats.precedentsCount) : '13',
      subtext: 'Followed & Overruled links',
      icon: Scale,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '—' : item.value}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {item.subtext}
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${item.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Statistics;
