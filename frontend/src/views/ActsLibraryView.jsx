import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ShieldAlert, 
  Scale, 
  FileText,
  Copy,
  Check,
  X
} from 'lucide-react';

export const ActsLibraryView = ({ selectedActId, onSelectSection }) => {
  const { toggleBookmark, isBookmarked, addToast } = useAuth();
  const [acts, setActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [actSections, setActSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSectionDetail, setSelectedSectionDetail] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadActs();
  }, []);

  const loadActs = async () => {
    setLoading(true);
    try {
      const res = await api.getActs();
      if (res.success) {
        setActs(res.acts);
        if (selectedActId) {
          loadActDetails(selectedActId);
        } else if (res.acts.length > 0) {
          loadActDetails(res.acts[0].id);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to load Acts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadActDetails = async (actId) => {
    try {
      const res = await api.getActById(actId);
      if (res.success) {
        setSelectedAct(res.act);
        setActSections(res.sections || []);
      }
    } catch (err) {
      addToast('Failed to load Act sections', 'error');
    }
  };

  const filteredActs = acts.filter(act => {
    const matchCategory = categoryFilter === 'all' || act.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = !searchQuery || 
      act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCopySection = (sec) => {
    const text = `${sec.actCode} ${sec.sectionNumber}: ${sec.title}\n\n${sec.content}\n\nPunishment: ${sec.punishment || 'N/A'}\nSource: ${sec.source}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Section provision copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-400" />
            <span>Statutory Acts & Sections Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete database of major Indian Criminal, Procedural, Constitutional, and Digital Evidence Statutes.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', 'Criminal', 'Procedure', 'Evidence', 'Constitutional', 'Cyber'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${categoryFilter === cat ? 'bg-blue-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'}`}
            >
              {cat === 'all' ? 'All Acts' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Acts or Section #..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Acts Grid & Selected Act Section Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Acts List */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Statutes ({filteredActs.length})</p>
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredActs.map(act => {
              const isSelected = selectedAct && selectedAct.id === act.id;
              return (
                <div
                  key={act.id}
                  onClick={() => loadActDetails(act.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-blue-600/15 border-blue-500 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{act.code}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {act.year}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-400">
                          {act.category}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{act.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{act.description}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>{act.totalSections} Sections • {act.totalChapters} Chapters</span>
                    <SourceBadge source={act.source} sourceUrl={act.sourceUrl} verified={act.verified} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sections in Selected Act */}
        <div className="lg:col-span-7 space-y-4">
          {selectedAct ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              {/* Selected Act Banner */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {selectedAct.actNumber}
                  </span>
                  <SourceBadge source={selectedAct.source} sourceUrl={selectedAct.sourceUrl} verified={selectedAct.verified} />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{selectedAct.name}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedAct.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Enacted</p>
                    <p className="font-bold text-slate-200">{selectedAct.enactmentDate || '1950'}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Effective Date</p>
                    <p className="font-bold text-slate-200">{selectedAct.effectiveDate || '2024-07-01'}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Total Sections</p>
                    <p className="font-bold text-slate-200">{selectedAct.totalSections}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Jurisdiction</p>
                    <p className="font-bold text-slate-200">{selectedAct.jurisdiction}</p>
                  </div>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Key Sections & Provisions ({actSections.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Click to view full statutory text</span>
                </div>

                {actSections.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    Full statutory index for {selectedAct.code} available via live search.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {actSections.map(sec => {
                      const bookmarked = isBookmarked(sec.id);
                      return (
                        <div
                          key={sec.id}
                          className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-blue-500/50 transition-all space-y-3 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-blue-400">{sec.sectionNumber}</span>
                                <span className="text-[11px] text-slate-400">• {sec.chapter}</span>
                              </div>
                              <h4 className="font-bold text-sm text-slate-100 mt-1">{sec.title}</h4>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleCopySection(sec)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                                title="Copy section"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleBookmark(sec.id)}
                                className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                              >
                                {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800 line-clamp-3">
                            {sec.content}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              {sec.punishment && (
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-medium">
                                  {sec.punishment}
                                </span>
                              )}
                              {sec.bailable && (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                  {sec.bailable}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => setSelectedSectionDetail(sec)}
                              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Full Provisions</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">Select an Act to explore sections</p>
            </div>
          )}
        </div>
      </div>

      {/* Section Detail Full Modal */}
      {selectedSectionDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedSectionDetail(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {selectedSectionDetail.actCode} • {selectedSectionDetail.chapter}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {selectedSectionDetail.sectionNumber}: {selectedSectionDetail.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSectionDetail(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statutory Text */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Statutory Legal Provision</p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedSectionDetail.content}
              </div>
            </div>

            {/* Key Penal & Procedural Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Punishment</span>
                <span className="font-bold text-rose-300">{selectedSectionDetail.punishment || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Bailability</span>
                <span className="font-bold text-slate-200">{selectedSectionDetail.bailable || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cognizability</span>
                <span className="font-bold text-slate-200">{selectedSectionDetail.cognizable || 'N/A'}</span>
              </div>
            </div>

            {/* Key Interpretations */}
            {selectedSectionDetail.keyPoints && selectedSectionDetail.keyPoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Legal Principles & Notes</p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedSectionDetail.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <SourceBadge source={selectedSectionDetail.source} sourceUrl={selectedSectionDetail.sourceUrl} verified={selectedSectionDetail.verified} />
              <button
                onClick={() => handleCopySection(selectedSectionDetail)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Provision'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
