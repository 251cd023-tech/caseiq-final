import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import { PrecedentGraphModal } from '../components/PrecedentGraphModal';
import {
  Gavel,
  Search,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Users,
  Calendar,
  Network,
  Copy,
  Check,
  ExternalLink,
  Scale,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const CasesPrecedentsView = ({ onAnalyzeCase, onOpenPrecedentMap }) => {
  const { toggleBookmark, isBookmarked, addToast } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [modalCase, setModalCase] = useState(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await api.getCases();
      if (res.success) {
        setCases(res.cases || []);
        if (res.cases && res.cases.length > 0) {
          setSelectedCase(res.cases[0]);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load Landmark Judgments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCitation = (citation, id) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    addToast('Citation copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCases = cases.filter(c => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = !s ||
      c.caseName.toLowerCase().includes(s) ||
      c.citation.toLowerCase().includes(s) ||
      c.bench.toLowerCase().includes(s) ||
      (c.legalTopics && c.legalTopics.some(t => t.toLowerCase().includes(s)));

    const matchesTopic = topicFilter === 'all' ||
      (c.legalTopics && c.legalTopics.some(t => t.toLowerCase().includes(topicFilter.toLowerCase())));

    return matchesSearch && matchesTopic;
  });

  const topicsList = ['all', 'Basic Structure Doctrine', 'Right to Privacy', 'Article 21', 'Arrest Guidelines', 'Mandatory Registration of FIR', 'Workplace Sexual Harassment', 'Medical Negligence', 'Narco-Analysis'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Supreme Court & High Court Precedents</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Landmark Judicial Precedents
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Authoritative judgments establishing binding constitutional doctrines, fundamental rights, procedural checks, and precedent chains across Indian courts.
            </p>
          </div>

          <button
            onClick={() => onOpenPrecedentMap && onOpenPrecedentMap(null)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Network className="w-4 h-4" />
            <span>Open Precedent Map</span>
          </button>
        </div>

        {/* Search & Topic Filters */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case name, citation, judge/bench, or legal topic..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Legal Doctrines</option>
              {topicsList.filter(t => t !== 'all').map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Case List & Deep Case Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Case Cards List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <span>Landmark Judgments ({filteredCases.length})</span>
            <span>Click to Inspect</span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading judgments database...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              No judgments found matching your search.
            </div>
          ) : (
            filteredCases.map(c => {
              const isSelected = selectedCase && selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer text-left space-y-3 group ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                          {c.year}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          {c.court}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {c.caseName}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(c.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Bookmark Case"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked(c.id) ? 'fill-indigo-400 text-indigo-400' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400">
                    {c.citation}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {(c.legalTopics || []).slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Case Inspection */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-6">
          {selectedCase ? (
            <>
              {/* Header Info */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                      {selectedCase.court}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {selectedCase.caseName}
                    </h2>
                  </div>

                  <SourceBadge verified={selectedCase.verified} source={selectedCase.source} sourceUrl={selectedCase.sourceUrl} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedCase.judgmentDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-xs">{selectedCase.bench}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCitation(selectedCase.citation, selectedCase.id)}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer ml-auto"
                  >
                    {copiedId === selectedCase.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{selectedCase.citation}</span>
                  </button>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(selectedCase.legalTopics || []).map((t, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5-Pillar Executive Summary */}
              {selectedCase.analysis && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>5-Pillar Case Decomposition</span>
                  </h4>

                  {/* Facts */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      1. Factual Matrix
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCase.analysis.facts}
                    </p>
                  </div>

                  {/* Issues */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      2. Issues Framed
                    </span>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {selectedCase.analysis.issues}
                    </p>
                  </div>

                  {/* Decision */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      3. Operative Decision & Order
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCase.analysis.decision}
                    </p>
                  </div>

                  {/* Reasoning */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      4. Ratio Decidendi & Judicial Reasoning
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCase.analysis.reasoning}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onAnalyzeCase && onAnalyzeCase(selectedCase)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Full AI 5-Pillar Analyzer</span>
                </button>

                <button
                  onClick={() => setModalCase(selectedCase)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Network className="w-4 h-4" />
                  <span>View Precedent Map</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Select a judgment to view details
            </div>
          )}
        </div>
      </div>

      {/* Precedent Graph Modal */}
      {modalCase && (
        <PrecedentGraphModal
          isOpen={Boolean(modalCase)}
          onClose={() => setModalCase(null)}
          caseId={modalCase.id}
          caseName={modalCase.caseName}
          onAnalyzeCase={onAnalyzeCase}
        />
      )}
    </div>
  );
};
