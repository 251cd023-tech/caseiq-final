import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LawRelationship } from '../components/law/LawRelationship';
import { OldLawCard } from '../components/law/OldLawCard';
import { NewLawCard } from '../components/law/NewLawCard';
import { WhatChanged } from '../components/law/WhatChanged';
import { RelatedPrecedents } from '../components/law/RelatedPrecedents';
import { ArrowRightLeft, Search, Sparkles, Scale, AlertCircle, Loader2, BookOpen, Layers } from 'lucide-react';

const QUICK_COMPARISONS = [
  { label: 'Murder (IPC 302 ➔ BNS 103)', query: '302' },
  { label: 'Theft (IPC 378/379 ➔ BNS 303)', query: '378' },
  { label: 'Dwelling Theft (IPC 380 ➔ BNS 305)', query: '380' },
  { label: 'Anticipatory Bail (CrPC 438 ➔ BNSS 482)', query: '438' },
  { label: 'Electronic Evidence (IEA 65B ➔ BSA 63)', query: '65B' }
];

export const LawComparison = () => {
  const [query, setQuery] = useState('302');
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [allMappings, setAllMappings] = useState([]);
  const [relatedPrecedents, setRelatedPrecedents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCompared, setHasCompared] = useState(false);

  useEffect(() => {
    loadAllMappings();
  }, []);

  const loadAllMappings = async () => {
    try {
      const res = await api.getLawMappings();
      if (res && res.success) {
        setAllMappings(res.mappings || []);
        if (res.mappings && res.mappings.length > 0) {
          executeCompare('302', res.mappings);
        }
      }
    } catch (err) {
      console.warn('Backend mappings unavailable:', err);
      // MOCK DATA: development fallback only. Not authoritative legal content.
      const fallbackMappings = [
        {
          id: 'map-1',
          category: 'Criminal Law Reform',
          oldAct: 'Indian Penal Code, 1860',
          oldSection: 'Section 302',
          oldTitle: 'Punishment for murder',
          newAct: 'Bharatiya Nyaya Sanhita, 2023',
          newSection: 'Section 103(1) & 103(2)',
          newTitle: 'Punishment for murder and mob lynching',
          oldProvision: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
          newProvision: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and fine. (2) When a group of five or more persons acting in concert commits murder on ground of race, caste, sex... each member shall be punished with death or life imprisonment.',
          punishmentChange: 'Maintains Death or Life Imprisonment; explicitly establishes capital punishment / life term for Mob Lynching by 5+ persons.',
          importantDifferences: [
            'Introduces dedicated sub-section (2) explicitly penalizing mob lynching and hate-motivated group killings',
            'Provides statutory definition of joint liability for mob attacks',
            'Clarity in sentencing calibration'
          ],
          notes: 'Historic criminal reform addressing mob violence and lynching without diluting classical murder jurisprudence.'
        }
      ];
      setAllMappings(fallbackMappings);
      setSelectedMapping(fallbackMappings[0]);
    }
  };

  const executeCompare = async (searchTerm, sourceList = allMappings) => {
    if (!searchTerm || !searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasCompared(true);

    try {
      const res = await api.compareLaw(searchTerm.trim());
      if (res && res.success && res.mappings && res.mappings.length > 0) {
        setSelectedMapping(res.mappings[0]);
        // Also check if any precedents relate to this section
        loadAssociatedPrecedents(searchTerm.trim(), res.mappings[0]);
      } else {
        // Search in local list
        const s = searchTerm.toLowerCase().trim();
        const matched = sourceList.find(m =>
          m.oldSection.toLowerCase().includes(s) ||
          m.newSection.toLowerCase().includes(s) ||
          m.oldTitle.toLowerCase().includes(s) ||
          m.newTitle.toLowerCase().includes(s)
        );

        if (matched) {
          setSelectedMapping(matched);
          loadAssociatedPrecedents(searchTerm.trim(), matched);
        } else {
          setSelectedMapping(null);
          setError(`No concordance mapping found matching "${searchTerm}". Try 302, 378, 438, or 65B.`);
        }
      }
    } catch (err) {
      // MOCK DATA: development fallback only. Not authoritative legal content.
      setError(err.message || 'Failed to compare statutory provisions.');
    } finally {
      setLoading(false);
    }
  };

  const loadAssociatedPrecedents = async (queryTerm, mapping) => {
    try {
      const casesRes = await api.getCases({ search: queryTerm });
      if (casesRes && casesRes.success && casesRes.cases.length > 0) {
        const formatted = casesRes.cases.slice(0, 2).map(c => ({
          caseId: c.id,
          caseName: c.caseName,
          court: c.court,
          citation: c.citation,
          relevance: c.analysis?.decision || c.keyHolding,
          relationshipType: 'Referred'
        }));
        setRelatedPrecedents(formatted);
      } else {
        setRelatedPrecedents([]);
      }
    } catch {
      setRelatedPrecedents([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCompare(query);
  };

  const handleQuickClick = (q) => {
    setQuery(q);
    executeCompare(q);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Statutory Concordance & Reform Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Old Law ➔ New Law Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Compare repealed Indian legal provisions (IPC, CrPC, IEA) directly with the reformed criminal codes (BNS 2023, BNSS 2023, BSA 2023) enacted on 1 July 2024.
        </p>

        {/* Search / Section Input */}
        <form onSubmit={handleSubmit} className="pt-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter section number or offense (e.g. 302, 378, 438, 65B, theft, murder)..."
              className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`absolute right-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer ${
                loading || !query.trim()
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25'
              }`}
            >
              {loading ? 'Comparing...' : 'Compare Law'}
            </button>
          </div>
        </form>

        {/* Quick Comparison Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Quick Compare:</span>
          {QUICK_COMPARISONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickClick(item.query)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading statutory reform data...</p>
        </div>
      )}

      {/* Error / Empty State */}
      {!loading && error && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{error}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Try clicking one of the quick comparison presets above.
          </p>
        </div>
      )}

      {/* SUCCESS: Strict Render Sequence per Spec */}
      {!loading && selectedMapping && (
        <div className="space-y-6 animate-fade-in">
          {/* 1. LawRelationship */}
          <LawRelationship mapping={selectedMapping} />

          {/* 2. OldLawCard + NewLawCard Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OldLawCard mapping={selectedMapping} />
            <NewLawCard mapping={selectedMapping} />
          </div>

          {/* 3. WhatChanged */}
          <WhatChanged mapping={selectedMapping} />

          {/* 4. RelatedPrecedents */}
          {relatedPrecedents.length > 0 && (
            <RelatedPrecedents precedents={relatedPrecedents} />
          )}
        </div>
      )}
    </div>
  );
};

export default LawComparison;
