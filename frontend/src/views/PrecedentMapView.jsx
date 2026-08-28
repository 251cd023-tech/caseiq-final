import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import {
  Network,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Compass,
  ExternalLink,
  ShieldCheck,
  Scale,
  Filter,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

const RELATION_METADATA = {
  Followed: {
    color: 'emerald',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
    desc: 'Affirmed and applied earlier constitutional ratio'
  },
  Overruled: {
    color: 'rose',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
    icon: XCircle,
    desc: 'Overturned and declared bad law by larger bench'
  },
  Distinguished: {
    color: 'amber',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    icon: AlertTriangle,
    desc: 'Differentiated based on distinct factual matrix or statutory scope'
  },
  Referred: {
    color: 'indigo',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-500',
    icon: Compass,
    desc: 'Cited and referenced in judicial discourse'
  }
};

export const PrecedentMapView = ({ focusCaseId = null, onSelectCase }) => {
  const { addToast } = useAuth();
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all'); // all | Followed | Overruled | Distinguished | Referred
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRel, setSelectedRel] = useState(null);

  useEffect(() => {
    loadRelationships();
  }, [focusCaseId]);

  const loadRelationships = async () => {
    setLoading(true);
    try {
      const res = await api.getCaseRelationships(focusCaseId || 'all');
      if (res.success) {
        const rels = res.relationships || [];
        setRelationships(rels);
        if (rels.length > 0) {
          setSelectedRel(rels[0]);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load precedent relationships', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = relationships.filter(r => {
    const matchesType = typeFilter === 'all' || r.relationshipType === typeFilter;
    const s = searchQuery.toLowerCase();
    const matchesSearch = !s ||
      r.sourceCaseName.toLowerCase().includes(s) ||
      r.targetCaseName.toLowerCase().includes(s) ||
      r.notes.toLowerCase().includes(s) ||
      r.citation.toLowerCase().includes(s);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>Judicial Precedent Topology</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Precedent Relationship Map
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Visualizing the doctrinal evolution of Indian law: how Supreme Court benches have Followed, Overruled, Distinguished, and Referred landmark precedents.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{relationships.length} Precedent Vectors</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search precedent nodes, cases, or citations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Followed', 'Overruled', 'Distinguished', 'Referred'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {type === 'all' ? 'All Relations' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Graph Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Precedent Relationship Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <span>Precedent Connections ({filtered.length})</span>
            <span>Click to Inspect Doctrine</span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Traversing precedent relationship graph...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No precedent links found for current filter.
            </div>
          ) : (
            filtered.map(rel => {
              const meta = RELATION_METADATA[rel.relationshipType] || RELATION_METADATA.Referred;
              const Icon = meta.icon;
              const isSelected = selectedRel && selectedRel.id === rel.id;

              return (
                <div
                  key={rel.id}
                  onClick={() => setSelectedRel(rel)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer text-left space-y-3 group ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${meta.badge}`}>
                        <Icon className="w-3 h-3" />
                        <span>{rel.relationshipType.toUpperCase()}</span>
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {rel.citation}
                    </span>
                  </div>

                  {/* Flow: Source -> Target */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/60">
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Originating Case</span>
                      <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {rel.sourceCaseName}
                      </p>
                    </div>

                    <div className="flex items-center justify-center sm:px-3 text-slate-500">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Target Precedent</span>
                      <p className="text-xs font-bold text-slate-200">
                        {rel.targetCaseName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rel.notes}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Node Deep Inspection & Visual Hierarchy */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-6">
          {selectedRel ? (
            <>
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${(RELATION_METADATA[selectedRel.relationshipType] || {}).dot}`} />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Precedent Vector Details
                    </span>
                  </div>

                  <SourceBadge verified={selectedRel.verified} source={selectedRel.citation} size="sm" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{selectedRel.relationshipType}</span>
                    <span className="text-[10px] font-mono text-slate-400">{selectedRel.citation}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {(RELATION_METADATA[selectedRel.relationshipType] || {}).desc}
                  </p>
                </div>
              </div>

              {/* Judicial Notes */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Judicial Ratio & Doctrinal Impact
                </span>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {selectedRel.notes}
                </div>
              </div>

              {/* Source vs Target Nodes */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    Source Judgment
                  </span>
                  <p className="text-xs font-semibold text-slate-100">{selectedRel.sourceCaseName}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Target Judgment / Earlier Precedent
                  </span>
                  <p className="text-xs font-semibold text-slate-100">{selectedRel.targetCaseName}</p>
                </div>
              </div>

              {/* Action Button */}
              {onSelectCase && (
                <button
                  onClick={() => onSelectCase({ id: selectedRel.sourceCaseId, caseName: selectedRel.sourceCaseName })}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Source Case in 5 Pillars</span>
                </button>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Select a precedent vector to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
