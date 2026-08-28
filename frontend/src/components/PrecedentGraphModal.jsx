import React, { useState, useEffect } from 'react';
import {
  X,
  Network,
  ArrowRight,
  GitCommit,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Filter,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { SourceBadge } from './SourceBadge';

const RELATION_STYLES = {
  Followed: {
    color: 'emerald',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
    line: '#10b981',
    description: 'Affirmed, followed and applied core ratio decidendi'
  },
  Overruled: {
    color: 'rose',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
    line: '#f43f5e',
    description: 'Explicitly declared bad law / overturned by larger bench'
  },
  Distinguished: {
    color: 'amber',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-500',
    line: '#f59e0b',
    description: 'Distinguished on specific factual or legal matrix'
  },
  Referred: {
    color: 'indigo',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dot: 'bg-indigo-500',
    line: '#6366f1',
    description: 'Cited and discussed in judicial reasoning'
  }
};

export const PrecedentGraphModal = ({
  isOpen,
  onClose,
  caseId,
  caseName,
  onAnalyzeCase
}) => {
  const [loading, setLoading] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [selectedRel, setSelectedRel] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!isOpen || !caseId) return;

    const fetchPrecedents = async () => {
      setLoading(true);
      try {
        const res = await api.getCaseRelationships(caseId);
        if (res.success && res.relationships) {
          setRelationships(res.relationships);
          if (res.relationships.length > 0) {
            setSelectedRel(res.relationships[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load precedent graph relationships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrecedents();
  }, [isOpen, caseId]);

  if (!isOpen) return null;

  const filteredRels = filterType === 'all'
    ? relationships
    : relationships.filter(r => r.relationshipType === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Interactive Precedent Intelligence
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {relationships.length} links
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {caseName || 'Case Precedent Relationship Network'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'Followed', 'Overruled', 'Distinguished', 'Referred'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer capitalize font-semibold ${
                filterType === type
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {type === 'all' ? 'All Relationships' : type}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[320px]">
          {/* Left: Nodes & Link List */}
          <div className="lg:col-span-7 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs">Computing judicial precedent vectors...</p>
              </div>
            ) : filteredRels.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-slate-800/80 p-6">
                <Network className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No matching precedent links found</p>
                <p className="text-xs text-slate-500 mt-1">Try switching relationship filters</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredRels.map(rel => {
                  const style = RELATION_STYLES[rel.relationshipType] || RELATION_STYLES.Referred;
                  const isSelected = selectedRel && selectedRel.id === rel.id;
                  const isSource = rel.sourceCaseId === caseId;

                  return (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedRel(rel)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                          {rel.relationshipType.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {rel.citation}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <span className={`truncate ${isSource ? 'text-blue-300 font-bold' : 'text-slate-300'}`}>
                          {rel.sourceCaseName}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className={`truncate ${!isSource ? 'text-blue-300 font-bold' : 'text-slate-300'}`}>
                          {rel.targetCaseName}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {rel.notes}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Link Deep Inspection */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            {selectedRel ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${(RELATION_STYLES[selectedRel.relationshipType] || {}).dot}`} />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Doctrine Analysis
                    </span>
                  </div>
                  <SourceBadge verified={selectedRel.verified} source={selectedRel.citation} size="sm" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Relationship Type
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-sm font-bold text-white mb-1">
                      {selectedRel.relationshipType}
                    </div>
                    <p className="text-xs text-slate-400">
                      {(RELATION_STYLES[selectedRel.relationshipType] || {}).description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Judicial Ratio / Precedent Notes
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {selectedRel.notes}
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Citation:</span>
                    <span className="text-slate-300 font-semibold">{selectedRel.citation}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-blue-400 truncate max-w-[200px]">{selectedRel.sourceCaseName}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-500">Target:</span>
                    <span className="text-indigo-400 truncate max-w-[200px]">{selectedRel.targetCaseName}</span>
                  </div>
                </div>

                {onAnalyzeCase && (
                  <button
                    onClick={() => {
                      onClose();
                      onAnalyzeCase({
                        id: selectedRel.sourceCaseId,
                        caseName: selectedRel.sourceCaseName
                      });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze in 5-Pillars Engine</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-500 text-center">
                <BookOpen className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs">Select a precedent connection to view judicial analysis and citation vectors</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified against Supreme Court of India Law Reports (SCC & AIR)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Close Graph
          </button>
        </div>
      </div>
    </div>
  );
};
