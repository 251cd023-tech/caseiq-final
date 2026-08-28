import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import {
  ArrowRightLeft,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Scale,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  GitBranch,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const LawMappingView = ({ selectedMappingId }) => {
  const { toggleBookmark, isBookmarked, addToast } = useAuth();
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actTypeFilter, setActTypeFilter] = useState('all'); // all | IPC | CrPC | IEA
  const [copiedId, setCopiedId] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    loadMappings();
  }, []);

  const loadMappings = async () => {
    setLoading(true);
    try {
      const res = await api.getLawMappings();
      if (res.success) {
        setMappings(res.mappings || []);
        if (selectedMappingId) {
          const m = res.mappings.find(x => x.id === selectedMappingId);
          if (m) setSelectedMap(m);
        } else if (res.mappings && res.mappings.length > 0) {
          setSelectedMap(res.mappings[0]);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load Law Mappings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyComparison = (m) => {
    const text = `CASEIQ OLD ↔ NEW LAW REFORM MAPPING
Category: ${m.category}
OLD LAW: ${m.oldAct} - ${m.oldSection} (${m.oldTitle})
Provision: ${m.oldProvision}

NEW LAW: ${m.newAct} - ${m.newSection} (${m.newTitle})
Provision: ${m.newProvision}

Punishment Change: ${m.punishmentChange}
Key Differences: ${(m.importantDifferences || []).join('; ')}
Notes: ${m.notes}`;

    navigator.clipboard.writeText(text);
    setCopiedId(m.id);
    addToast('Mapping comparison copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMappings = mappings.filter(m => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = !s ||
      m.oldSection.toLowerCase().includes(s) ||
      m.newSection.toLowerCase().includes(s) ||
      m.oldTitle.toLowerCase().includes(s) ||
      m.newTitle.toLowerCase().includes(s) ||
      m.category.toLowerCase().includes(s) ||
      m.punishmentChange.toLowerCase().includes(s);

    const matchesAct = actTypeFilter === 'all' ||
      m.oldAct.toLowerCase().includes(actTypeFilter.toLowerCase()) ||
      m.newAct.toLowerCase().includes(actTypeFilter.toLowerCase());

    return matchesSearch && matchesAct;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Criminal Law Transition Framework</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Old Law ↔ New Law Converter
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Side-by-side legal concordance for IPC ➔ BNS, CrPC ➔ BNSS, and Indian Evidence Act ➔ BSA with highlighted punishment amendments and procedural changes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Effective 1 July 2024</span>
          </div>
        </div>

        {/* Search & Act Type Filter Tabs */}
        <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by section (e.g. 302, 420, 305, 482, 65B) or offence name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Codes' },
              { id: 'IPC', label: 'IPC ➔ BNS' },
              { id: 'CrPC', label: 'CrPC ➔ BNSS' },
              { id: 'Evidence', label: 'IEA ➔ BSA' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  actTypeFilter === tab.id
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading Concordance Table...</p>
          </div>
        ) : filteredMappings.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No law mappings found matching your search.
          </div>
        ) : (
          filteredMappings.map(m => (
            <div
              key={m.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-slate-700 transition-all shadow-xl"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase tracking-wider">
                    {m.category}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {m.oldAct.split(',')[0]} {m.oldSection} ➔ {m.newAct.split(',')[0]} {m.newSection}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyComparison(m)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                    title="Copy Side-by-Side Comparison"
                  >
                    {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(m.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isBookmarked(m.id)
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Save to Bookmarks"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(m.id) ? 'fill-purple-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Split View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Old Law */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      OLD: {m.oldAct}
                    </span>
                    <span className="font-mono text-slate-400 font-bold">{m.oldSection}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{m.oldTitle}</div>
                  <div className="text-xs text-slate-300 leading-relaxed pt-1">
                    {m.oldProvision}
                  </div>
                </div>

                {/* Right: New Law */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      NEW: {m.newAct}
                    </span>
                    <span className="font-mono text-emerald-300 font-bold">{m.newSection}</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{m.newTitle}</div>
                  <div className="text-xs text-slate-200 leading-relaxed pt-1">
                    {m.newProvision}
                  </div>
                </div>
              </div>

              {/* Punishment Change & Differences Callout */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Punishment & Procedural Amendments:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {m.punishmentChange}
                </p>

                {m.importantDifferences && m.importantDifferences.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Differences:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {m.importantDifferences.map((diff, idx) => (
                        <li key={idx} className="leading-relaxed">{diff}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer / Notes */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                <p className="italic">💡 {m.notes}</p>
                <SourceBadge verified={m.verified} source={m.source} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
