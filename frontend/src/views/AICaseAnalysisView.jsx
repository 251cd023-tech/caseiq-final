import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SourceBadge } from '../components/SourceBadge';
import {
  Sparkles,
  FileText,
  HelpCircle,
  Scale,
  CheckCircle2,
  BookCheck,
  Copy,
  Check,
  Download,
  Share2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Users
} from 'lucide-react';

export const AICaseAnalysisView = ({ targetCase = null }) => {
  const { addToast } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(targetCase ? targetCase.id : '');
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState('select'); // 'select' | 'custom'

  useEffect(() => {
    loadCasesList();
  }, []);

  useEffect(() => {
    if (targetCase) {
      setSelectedCaseId(targetCase.id);
      setActiveInputMode('select');
      triggerAnalysis({ caseId: targetCase.id });
    }
  }, [targetCase]);

  const loadCasesList = async () => {
    try {
      const res = await api.getCases();
      if (res.success && res.cases) {
        setCases(res.cases);
        if (!selectedCaseId && res.cases.length > 0 && !targetCase) {
          setSelectedCaseId(res.cases[0].id);
          triggerAnalysis({ caseId: res.cases[0].id });
        }
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    }
  };

  const triggerAnalysis = async (payload) => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeCase(payload);
      if (res.success) {
        setAnalysisResult(res);
      }
    } catch (err) {
      addToast(err.message || 'AI Case Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectCaseChange = (caseId) => {
    setSelectedCaseId(caseId);
    triggerAnalysis({ caseId });
  };

  const handleCustomAnalyze = (e) => {
    e.preventDefault();
    if (!rawText.trim()) {
      addToast('Please enter judgment facts or legal text to analyze', 'warning');
      return;
    }
    triggerAnalysis({ rawText: rawText.trim(), caseName: 'Custom Scenario Legal Decomposition' });
  };

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    const a = analysisResult.analysis;
    const text = `CASEIQ 5-PILLAR AI CASE ANALYSIS
Title: ${analysisResult.caseName}
Citation: ${analysisResult.citation}
Court: ${analysisResult.court}

PILLAR 1: FACTS MATRIX
${a.facts}

PILLAR 2: LEGAL ISSUES FRAMED
${a.issues}

PILLAR 3: COMPETING ARGUMENTS
• Petitioner / Appellant:
${typeof a.arguments === 'object' ? a.arguments.petitioner : a.arguments}
• Respondent / State:
${typeof a.arguments === 'object' ? a.arguments.respondent : ''}

PILLAR 4: OPERATIVE DECISION & ORDERS
${a.decision}

PILLAR 5: JUDICIAL REASONING & RATIO DECIDENDI
${a.reasoning}

Verified Source: ${analysisResult.source || 'Supreme Court of India'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('5-Pillar Analysis copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-Pillar Case  Synthesis Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              AI Legal Case Analyzer
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Extract and structure any Indian Supreme Court / High Court judgment or custom scenario into the foundational 5 Pillars: Facts → Issues → Arguments → Decision → Reasoning.
            </p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveInputMode('select')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeInputMode === 'select'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Select Landmark Case
            </button>
            <button
              onClick={() => setActiveInputMode('custom')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeInputMode === 'custom'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyze Custom Text
            </button>
          </div>
        </div>

        {/* Input Selector or Custom Form */}
        <div className="pt-6">
          {activeInputMode === 'select' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Precedent to Analyze:
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => handleSelectCaseChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.caseName} ({c.year}) — {c.citation}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <form onSubmit={handleCustomAnalyze} className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Paste Judgment Raw Text or Factual Matrix:
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste case facts, FIR details, or legal arguments here (e.g. Theft in residential dwelling house with unauthorized entry at night, or Anticipatory bail plea in 498A complaint)..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={analyzing}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{analyzing ? 'Decomposing 5 Pillars...' : 'Decompose Text into 5 Pillars'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Analysis Result Container */}
      {analyzing ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 text-slate-400">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-200">Executing 5-Pillar Case Decomposition</p>
            <p className="text-xs text-slate-500">Extracting Facts, framing Legal Issues, isolating Competing Arguments & Ratio Decidendi...</p>
          </div>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AI SYNTHESIS COMPLETE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: {Math.round((analysisResult.confidenceScore || 0.95) * 100)}%
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {analysisResult.caseName}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {analysisResult.citation} • {analysisResult.court}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyAnalysis}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Full Breakdown' : 'Copy 5-Pillar Matrix'}</span>
              </button>

              <SourceBadge verified={analysisResult.verified} source={analysisResult.source} size="sm" />
            </div>
          </div>

          {/* The 5 Pillars Cards */}
          <div className="space-y-4">
            {/* Pillar 1: Facts Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Pillar 1: Factual Matrix & Background
                    </h3>
                    <p className="text-[11px] text-slate-400">Chronology of events, parties involved, and procedural genesis</p>
                  </div>
                </div>
                <FileText className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                {analysisResult.analysis.facts}
              </div>
            </div>

            {/* Pillar 2: Legal Issues Framed */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Pillar 2: Legal Issues Framed
                    </h3>
                    <p className="text-[11px] text-slate-400">Substantive questions of law requiring judicial determination</p>
                  </div>
                </div>
                <HelpCircle className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {analysisResult.analysis.issues}
              </div>
            </div>

            {/* Pillar 3: Competing Arguments */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Pillar 3: Competing Legal Arguments
                    </h3>
                    <p className="text-[11px] text-slate-400">Contentions of Petitioner / Appellant versus Respondent / State</p>
                  </div>
                </div>
                <Users className="w-5 h-5 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Petitioner */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Petitioner / Appellant Submission
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {typeof analysisResult.analysis.arguments === 'object'
                      ? analysisResult.analysis.arguments.petitioner
                      : analysisResult.analysis.arguments}
                  </p>
                </div>

                {/* Respondent */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Respondent / State Defense
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {typeof analysisResult.analysis.arguments === 'object'
                      ? analysisResult.analysis.arguments.respondent
                      : 'Countered on statutory discretion, limitation, and legitimate state regulatory interest.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4: Operative Decision */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Pillar 4: Operative Decision & Court Order
                    </h3>
                    <p className="text-[11px] text-slate-400">Final verdict, relief granted, directions, or statute struck down</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed font-medium">
                {analysisResult.analysis.decision}
              </div>
            </div>

            {/* Pillar 5: Judicial Reasoning */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Pillar 5: Ratio Decidendi & Judicial Reasoning
                    </h3>
                    <p className="text-[11px] text-slate-400">Legal doctrines, constitutional philosophy, and binding jurisprudence</p>
                  </div>
                </div>
                <Scale className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed">
                {analysisResult.analysis.reasoning}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
