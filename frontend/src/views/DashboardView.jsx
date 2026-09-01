import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Bookmark,
  History,
  Scale,
  GitBranch,
  ArrowRight,
  Clock,
  ArrowRightLeft,
  ChevronRight,
  BookmarkCheck
} from 'lucide-react';

// Premium Mock Data specifically tailored for Indian & Tamil Nadu legal contexts
const MOCK_STATS = [
  { label: 'Saved Cases', value: '3', icon: BookmarkCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { label: 'Recent Searches', value: '4', icon: History, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Reform Mappings', value: '156', icon: ArrowRightLeft, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { label: 'Precedents Explored', value: '42', icon: Scale, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
];

const MOCK_RECENT_SEARCHES = [
  { id: 'rs-1', query: 'Anticipatory bail guidelines Section 438 CrPC vs 482 BNSS', relativeTime: '2 hours ago' },
  { id: 'rs-2', query: 'Medical negligence landmark rulings Tamil Nadu', relativeTime: '5 hours ago' },
  { id: 'rs-3', query: 'Admissibility of electronic records Section 65B Indian Evidence Act', relativeTime: '1 day ago' },
  { id: 'rs-4', query: 'Definition of murder and punishment under BNS Section 103', relativeTime: '2 days ago' }
];

const MOCK_SAVED_CASES = [
  {
    id: 'case-puttaswamy',
    caseName: 'K.S. Puttaswamy v. Union of India',
    citation: '(2017) 10 SCC 1',
    court: 'Supreme Court of India',
    keyHolding: 'Held that the Right to Privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21.',
    category: 'Constitutional Law'
  },
  {
    id: 'case-jacob',
    caseName: 'Jacob Mathew v. State of Punjab',
    citation: '(2005) 6 SCC 1',
    court: 'Supreme Court of India',
    keyHolding: 'Established guidelines for criminal liability of medical professionals in cases of negligence.',
    category: 'Criminal / Medical Law'
  },
  {
    id: 'case-nalini',
    caseName: 'State of Tamil Nadu v. Nalini',
    citation: 'AIR 1999 SC 2640',
    court: 'Supreme Court of India',
    keyHolding: 'Landmark decision concerning criminal conspiracy, evidence evaluation, and confessions under special acts.',
    category: 'Criminal Procedure'
  }
];

const MOCK_RESEARCH_HISTORY = [
  { id: 'act-1', description: 'Compared Section 378 IPC (Theft) with Section 303 BNS (Theft)', time: '10 mins ago', type: 'mapping' },
  { id: 'act-2', description: 'Ran AI 5-Pillar Case Analysis on Puttaswamy judgment', time: '1 hour ago', type: 'analysis' },
  { id: 'act-3', description: 'Exported precedent relationship graph for Nalini case', time: 'Yesterday', type: 'precedent' },
  { id: 'act-4', description: 'Inspected Section 65B of Indian Evidence Act vs Section 63 BSA', time: '2 days ago', type: 'mapping' }
];

const MOCK_RELATED_PRECEDENTS = [
  {
    caseName: 'Selvi v. State of Karnataka',
    citation: '(2010) 7 SCC 263',
    court: 'Supreme Court of India',
    relevance: 'Narco-analysis, Article 20(3) rights, often referenced in Tamil Nadu investigation procedures.',
    status: 'Followed'
  },
  {
    caseName: 'State of Tamil Nadu v. Suhas Katti',
    citation: 'CC No. 4680/W of 2004',
    court: 'Trial Court, Chennai',
    relevance: 'Landmark Indian cyber harassment precedent regarding publication of obscene material under IT Act.',
    status: 'Referred'
  },
  {
    caseName: 'Kartar Singh v. State of Punjab',
    citation: '(1994) 3 SCC 569',
    court: 'Supreme Court of India',
    relevance: 'Key precedent concerning constitutional validity of special security laws and criminal procedures.',
    status: 'Followed'
  }
];

export const DashboardView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    const queryStr = e.target.searchQuery.value.trim();
    if (queryStr) {
      // Navigate to search legal view with search query
      navigate(`/search?q=${encodeURIComponent(queryStr)}`);
    }
  };

  const handleRecentQueryClick = (queryText) => {
    navigate(`/search?q=${encodeURIComponent(queryText)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Workspace Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Counsel'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Role: <span className="text-slate-200 font-semibold">{user?.role || 'Advocate'}</span> • {user?.organization || 'High Court of Madras'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-semibold text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Prototype Mode (Mock Data Active)</span>
          </div>
        </div>

        {/* Global Instant Search Bar inside Dashboard */}
        <form onSubmit={handleQuickSearchSubmit} className="mt-6 max-w-2xl relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            name="searchQuery"
            placeholder="Search laws, sections, cases or ask a legal question..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <h3 className="text-lg font-bold text-white mt-0.5">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left Widgets, Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Searches & Saved Cases (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Saved Cases Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white">Saved Cases / Judgments</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Prototype Saved Set</span>
            </div>

            <div className="space-y-3.5">
              {MOCK_SAVED_CASES.map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.citation}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-white">{c.caseName}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{c.keyHolding}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                    <span>{c.court}</span>
                    <button
                      onClick={() => navigate('/cases')}
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Analyze</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Recent AI Searches</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Sync Active</span>
            </div>

            <div className="space-y-2">
              {MOCK_RECENT_SEARCHES.map(search => (
                <div
                  key={search.id}
                  onClick={() => handleRecentQueryClick(search.query)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-emerald-400 transition-colors">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-slate-300 group-hover:text-white truncate">
                      "{search.query}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{search.relativeTime}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Side: Research History & Related Precedents (Span 1) */}
        <div className="space-y-6">
          
          {/* Related Precedents Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Relevant Precedents</h2>
              </div>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">SC / TN</span>
            </div>

            <div className="space-y-3">
              {MOCK_RELATED_PRECEDENTS.map((prec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{prec.caseName}</h3>
                    <span className="text-[8px] font-bold uppercase px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                      {prec.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">{prec.citation} • {prec.court}</p>
                  <p className="text-[10px] text-slate-400 leading-normal italic">Relevance: {prec.relevance}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Research History / Recent Activities */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Activity Log</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Timeline</span>
            </div>

            <div className="relative pl-4 border-l border-slate-800 space-y-4 text-xs">
              {MOCK_RESEARCH_HISTORY.map((activity) => (
                <div key={activity.id} className="relative space-y-0.5">
                  {/* Timeline dot */}
                  <span className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 border border-slate-950" />
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-400">
                      {activity.type === 'mapping' ? 'Concordance' : activity.type === 'analysis' ? 'AI Case' : 'Precedent'}
                    </span>
                    <span>{activity.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Old ➔ New Concordance Converter Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/20 to-slate-950 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-xs font-bold">2024 Legal Reform Crosswalk</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Quickly cross-reference sections between IPC & BNS, CrPC & BNSS, and IEA & BSA.
            </p>
            <button
              onClick={() => navigate('/law-comparison')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Launch Law Concordance</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
