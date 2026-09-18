import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
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
import { SearchBar } from '../components/SearchBar';
import { CaseCard } from '../components/CaseCard';
import { SourceBadge } from '../components/SourceBadge';
import { PrecedentGraphModal } from '../components/PrecedentGraphModal';

export const SearchLegalView = ({
  initialQuery = '',
  onNavigateToCase,
  onNavigateToSection,
  onNavigateToMapping,
  onAnalyzeCase
}) => {
  const { toggleBookmark, isBookmarked, addToast } = useAuth();
  const navigate = useNavigate();

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
      const res = await api.searchLegal(searchQuery.trim(), filterType, 30);
      if (res && res.success) {
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

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Search Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4 transition-colors">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Legal Natural Language Search Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Indian Statutory & Precedent Intelligence
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Search natural language queries across BNS, BNSS, BSA, IPC, CrPC, Evidence Act, Constitution of India, and Supreme Court Landmark Judgments.
          </p>
        </div>

        {/* Integrated SearchBar Component */}
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={(q, f) => executeSearch(q, f)}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          loading={loading}
        />
      </div>

      {/* Results Header Counter */}
      {hasSearched && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing results for <strong className="text-slate-800 dark:text-slate-200">"{query}"</strong>
          </span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/20">
            {totalResults} {totalResults === 1 ? 'Match' : 'Matches'} Found
          </span>
        </div>
      )}

      {/* Search Results Display */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-500 dark:text-slate-400">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold">Scanning BNS, BNSS, BSA codes and Supreme Court jurisprudence...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((item, idx) => {
            // If item is a Case, render CaseCard
            if (item.type === 'case') {
              return (
                <CaseCard
                  key={item.id || idx}
                  caseData={item.rawItem || item}
                  onAnalyze={() => onAnalyzeCase && onAnalyzeCase(item.rawItem || item)}
                />
              );
            }

            // Otherwise render Section / Reform Mapping / Precedent Link
            return (
              <div
                key={item.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-5 sm:p-6 transition-all shadow-sm group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.type === 'section'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                            : item.type === 'mapping'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                        }`}
                      >
                        {item.type.toUpperCase()}
                      </span>

                      {item.actCode && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.actCode}
                        </span>
                      )}

                      {item.predecessorSection && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                          Old: {item.predecessorSection}
                        </span>
                      )}

                      {item.relevanceScore && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                          <Zap className="w-3 h-3" />
                          <span>Relevance: {Math.round(parseFloat(item.relevanceScore) * 100)}%</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>

                    {item.citation && (
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {item.citation} {item.court ? `• ${item.court}` : ''}
                      </p>
                    )}

                    {/* Snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      {item.snippet || item.keyHolding || item.content}
                    </p>

                    {/* Section Badges */}
                    {item.type === 'section' && (
                      <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                        {item.punishment && (
                          <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                            <span className="text-slate-500 font-semibold">Punishment:</span> {item.punishment}
                          </div>
                        )}
                        {item.bailable && (
                          <div
                            className={`px-2.5 py-1 rounded-xl border ${
                              item.bailable.toLowerCase().includes('non-bailable')
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border-rose-200 dark:border-rose-500/20'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20'
                            }`}
                          >
                            {item.bailable}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Source Badge */}
                  <div className="shrink-0 self-start">
                    <SourceBadge
                      verified={item.verified}
                      source={item.source}
                      sourceUrl={item.sourceUrl}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.type === 'section' && (
                      <button
                        type="button"
                        onClick={() => onNavigateToSection && onNavigateToSection(item.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>View in Acts Library</span>
                      </button>
                    )}

                    {item.type === 'mapping' && (
                      <button
                        type="button"
                        onClick={() => navigate('/law-comparison')}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Side-by-Side Comparison</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    aria-label={isBookmarked(item.id) ? 'Remove Bookmark' : 'Save Bookmark'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs ${
                      isBookmarked(item.id)
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/40'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(item.id) ? 'fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400' : ''}`} />
                    <span className="hidden sm:inline">{isBookmarked(item.id) ? 'Saved' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Direct Matches Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try searching with broader statutory terms or click one of the suggested query chips above.
          </p>
        </div>
      ) : (
        /* Showcase Default State */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">All 10 Core Indian Acts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore BNS, BNSS, BSA, IPC, CrPC, Evidence Act, COI, IT Act, POCSO, and Consumer Protection Act with full section provisions and punishment schedules.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">5-Pillar Case Analysis</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Decompose complex judgments into structured Facts, Issues, Competing Arguments, Operative Decision, and Ratio Decidendi in seconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 w-fit">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Precedent Network Maps</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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

export default SearchLegalView;
