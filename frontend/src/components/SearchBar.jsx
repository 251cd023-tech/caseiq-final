import React, { useState } from 'react';
import { Search, Sparkles, X, Filter } from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All Results' },
  { id: 'section', label: 'Acts & Sections' },
  { id: 'case', label: 'Landmark Cases' },
  { id: 'mapping', label: 'Reform Maps' },
  { id: 'precedent', label: 'Precedents' }
];

const SUGGESTIONS = [
  'Theft in dwelling house',
  'Anticipatory bail rules',
  'Right to Privacy Article 21',
  'Electronic Evidence Section 65B vs 63',
  'Medical negligence Jacob Mathew',
  'Workplace sexual harassment Vishaka'
];

export const SearchBar = ({
  query = '',
  onQueryChange,
  onSearch,
  activeFilter = 'all',
  onFilterChange,
  loading = false,
  placeholder = 'Search laws, sections, landmark judgments, or legal questions...'
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localQuery, activeFilter);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    if (onQueryChange) onQueryChange('');
  };

  const handleChipClick = (chip) => {
    setLocalQuery(chip);
    if (onQueryChange) onQueryChange(chip);
    if (onSearch) onSearch(chip, activeFilter);
  };

  const handleFilterClick = (filterId) => {
    if (onFilterChange) onFilterChange(filterId);
    if (localQuery.trim() && onSearch) {
      onSearch(localQuery, filterId);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              if (onQueryChange) onQueryChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !localQuery.trim()}
              className={`px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                loading || !localQuery.trim()
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterClick(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Try searching:</span>
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            type="button"
            onClick={() => handleChipClick(sug)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700/40 transition-all cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
