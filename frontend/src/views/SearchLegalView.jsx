import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Filter,
  BookOpen,
  Scale,
  GitBranch,
  ArrowRight,
  Bookmark,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import { PrecedentGraphModal } from '../components/PrecedentGraphModal';

const PROMPT_CHIPS = [
  'Theft in dwelling house',
  'Anticipatory bail rules',
  'Right to Privacy Article 21',
  'Electronic Evidence Section 65B vs 63',
  'Medical negligence Jacob Mathew',
  'Workplace sexual harassment Vishaka'
];

export const SearchLegalView = ({
  initialQuery = '',
  onNavigateToCase,
  onNavigateToSection,
  onNavigateToMapping,
  onAnalyzeCase
}) => {
  const { toggleBookmark, isBookmarked, addToast } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery, activeFilter);
    }
  }, [initialQuery]);

  const executeSearch = async (searchQuery, filterType = activeFilter) => {
    if (!searchQuery || !searchQuery.trim()) {
      addToast('Please enter a legal query to search', 'warning');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.searchLegal({
        query: searchQuery.trim(),
        type: filterType,
        limit: 30
      });
      if (res.success) {
        setResults(res.results || []);
        setTotalResults(res.totalResults || 0);
        setSuggestions(res.suggestions || []);
      }
    } catch (err) {
      console.error('Search failed:', err);
      addToast(err.message || 'Legal search failed. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query, activeFilter);
  };

  const handleChipClick = (chip) => {
    setQuery(chip);
    executeSearch(chip, activeFilter);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (query.trim()) {
      executeSearch(query, filter);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Legal Natural Language Search Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Indian Statutory & Precedent Intelligence
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Search natural language queries across BNS, BNSS, BSA, IPC, CrPC, Evidence Act, Constitution of India, and Supreme Court Landmark Judgments.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a legal question in plain English (e.g. Theft in dwelling house, Anticipatory bail rules)..."
                className="w-full bg-transparent px-4 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="mr-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? 'Searching...' : 'Search Law'}
              </button>
            </div>
          </form>

          {/* Prompt Chips */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Suggested Legal Queries:
            </span>
            <div className="flex flex-wrap gap-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/60 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>{chip}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Legal Documents', icon: Layers },
            { id: 'sections', label: 'Statutory Sections', icon: BookOpen },
            { id: 'cases', label: 'Landmark Cases', icon: Scale },
            { id: 'mappings', label: 'Old ↔ New Reforms', icon: GitBranch },
            { id: 'precedents', label: 'Precedent Links', icon: Zap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {hasSearched && (
          <div className="text-xs text-slate-400 font-mono">
            Found <span className="text-blue-400 font-bold">{totalResults}</span> relevant matches
          </div>
        )}
      </div>

      {/* Search Results Display */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Scanning BNS, BNSS, BSA codes and Supreme Court jurisprudence...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  {/* Top badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.type === 'section'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.type === 'case'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : item.type === 'mapping'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>

                    {item.actCode && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {item.actCode}
                      </span>
                    )}

                    {item.predecessorSection && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Old: {item.predecessorSection}
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 ml-auto sm:ml-0 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Zap className="w-3 h-3" />
                      <span>Relevance: {Math.round(parseFloat(item.relevanceScore) * 100)}%</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  {item.citation && (
                    <p className="text-xs font-mono text-slate-400">
                      {item.citation} • {item.court}
                    </p>
                  )}

                  {/* Snippet / Description */}
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {item.snippet || item.keyHolding || item.content}
                  </p>

                  {/* Badges for Sections: Punishment, Bailable, Cognizable */}
                  {item.type === 'section' && (
                    <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                      {item.punishment && (
                        <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                          <span className="text-slate-500 font-semibold">Punishment:</span> {item.punishment}
                        </div>
                      )}
                      {item.bailable && (
                        <div className={`px-2.5 py-1 rounded-xl border ${
                          item.bailable.toLowerCase().includes('non-bailable')
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        }`}>
                          {item.bailable}
                        </div>
                      )}
                      {item.cognizable && (
                        <div className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {item.cognizable}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Source Verification Badge */}
                <div className="shrink-0 self-start">
                  <SourceBadge
                    verified={item.verified}
                    source={item.source}
                    sourceUrl={item.sourceUrl}
                    size="sm"
                  />
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2">
                  {item.type === 'case' && (
                    <>
                      <button
                        onClick={() => onAnalyzeCase && onAnalyzeCase(item.rawItem || item)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI 5-Pillar Analysis</span>
                      </button>

                      <button
                        onClick={() => setSelectedCaseForModal(item.rawItem || item)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Precedent Graph</span>
                      </button>
                    </>
                  )}

                  {item.type === 'section' && (
                    <button
                      onClick={() => onNavigateToSection && onNavigateToSection(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>View in Acts Library</span>
                    </button>
                  )}

                  {item.type === 'mapping' && (
                    <button
                      onClick={() => onNavigateToMapping && onNavigateToMapping(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Side-by-Side Comparison</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleBookmark(item.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs ${
                    isBookmarked(item.id)
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={isBookmarked(item.id) ? 'Remove Bookmark' : 'Save to Bookmarks'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked(item.id) ? 'fill-blue-400 text-blue-400' : ''}`} />
                  <span className="hidden sm:inline">{isBookmarked(item.id) ? 'Saved' : 'Bookmark'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Direct Matches Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try searching with broader statutory terms or click one of the suggested query chips above.
          </p>
        </div>
      ) : (
        /* Default Empty State Showcase */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">All 10 Core Indian Acts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore BNS, BNSS, BSA, IPC, CrPC, Evidence Act, COI, IT Act, POCSO, and Consumer Protection Act with full section provisions and punishment schedules.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">5-Pillar Case Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decompose complex judgments into structured Facts, Issues, Competing Arguments, Operative Decision, and Ratio Decidendi in seconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="p-3 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 w-fit">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Precedent Network Maps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trace how Supreme Court benches have Followed, Overruled, Distinguished, and Referred landmark precedents across decades.
            </p>
          </div>
        </div>
      )}

      {/* Precedent Graph Modal */}
      {selectedCaseForModal && (
        <PrecedentGraphModal
          isOpen={Boolean(selectedCaseForModal)}
          onClose={() => setSelectedCaseForModal(null)}
          caseId={selectedCaseForModal.id}
          caseName={selectedCaseForModal.caseName || selectedCaseForModal.title}
          onAnalyzeCase={onAnalyzeCase}
        />
      )}
    </div>
  );
};
