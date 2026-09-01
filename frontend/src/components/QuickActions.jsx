import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft, BookmarkCheck, BookOpen, BrainCircuit, Gavel, ArrowRight, Sparkles } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'AI Legal Search',
      description: 'Search across 10 Central Acts & Landmark Judgments',
      icon: Search,
      path: '/search',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Natural Language'
    },
    {
      label: 'Old ➔ New Law Comparison',
      description: 'Compare IPC ➔ BNS, CrPC ➔ BNSS, and IEA ➔ BSA',
      icon: ArrowRightLeft,
      path: '/law-comparison',
      color: 'from-amber-600 to-emerald-600',
      badge: '2024 Reforms'
    },
    {
      label: 'Saved Cases & Notes',
      description: 'Review bookmarked precedents & statutory provisions',
      icon: BookmarkCheck,
      path: '/saved',
      color: 'from-blue-700 to-cyan-600',
      badge: 'Personal Depot'
    },
    {
      label: 'Landmark Precedents',
      description: 'Explore Supreme Court doctrine graphs & citations',
      icon: Gavel,
      path: '/cases',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Constitutional'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Quick Actions</span>
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-500">Core Research Portals</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(action.path)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
