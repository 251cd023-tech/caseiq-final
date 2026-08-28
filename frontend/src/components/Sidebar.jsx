import React from 'react';
import { 
  Search, 
  BookOpen, 
  Gavel, 
  BrainCircuit, 
  GitFork, 
  ArrowRightLeft, 
  Users, 
  BookmarkCheck,
  FileBadge2,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    {
      id: 'search',
      label: 'AI Legal Search',
      description: 'Natural Language Search & Query',
      icon: Search,
      badge: 'AI Core'
    },
    {
      id: 'acts',
      label: 'Acts & Sections',
      description: 'Statutory Law Library & BNS/CrPC',
      icon: BookOpen
    },
    {
      id: 'cases',
      label: 'Cases & Precedents',
      description: 'Supreme Court & High Court',
      icon: Gavel
    },
    {
      id: 'ai-analysis',
      label: '5-Pillar AI Analysis',
      description: 'Facts → Issues → Decision → Reasoning',
      icon: BrainCircuit,
      badge: '5 Pillars'
    },
    {
      id: 'precedents-map',
      label: 'Precedent Map',
      description: 'Followed, Overruled & Distinguished',
      icon: GitFork
    },
    {
      id: 'law-mapping',
      label: 'Old ➔ New Law Crosswalk',
      description: 'IPC ➔ BNS, CrPC ➔ BNSS, IEA ➔ BSA',
      icon: ArrowRightLeft,
      badge: '2024 Reform'
    },
    {
      id: 'community',
      label: 'Legal Community',
      description: 'Insights, Discussions & Q&A',
      icon: Users
    },
    {
      id: 'bookmarks',
      label: 'Saved Research',
      description: 'Bookmarks & Search History',
      icon: BookmarkCheck
    }
  ];

  return (
    <aside className="w-64 lg:w-72 shrink-0 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between py-4 select-none min-h-[calc(100vh-4rem)]">
      <div className="space-y-6 px-3">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Research Modules
          </p>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <div className="truncate">
                      <p className={`text-xs lg:text-sm font-medium leading-none truncate ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}>
                        {item.label}
                      </p>
                      <p className={`text-[10px] mt-1 truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Verification Notice Card */}
        <div className="px-1">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <FileBadge2 className="w-4 h-4" />
              <span className="text-xs font-bold">100% Verified Citations</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every section & precedent includes official Gazette of India and Supreme Court Reports citation tags.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="px-4 pt-4 border-t border-slate-900 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-400">CaseIQ AI Engine v1.0</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Benchmarrk Academy • Industry Ready</p>
      </div>
    </aside>
  );
};
