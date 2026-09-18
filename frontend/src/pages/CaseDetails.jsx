import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CaseHeader } from '../components/case/CaseHeader';
import { CaseSummary } from '../components/case/CaseSummary';
import { CaseFacts } from '../components/case/CaseFacts';
import { KeyPrinciples } from '../components/case/KeyPrinciples';
import { CourtInfo } from '../components/case/CourtInfo';
import { RelevanceAnalysis } from '../components/case/RelevanceAnalysis';
import { RelatedPrecedents } from '../components/case/RelatedPrecedents';
import { ArrowLeft, Loader2, AlertCircle, Sparkles, BrainCircuit, Scale } from 'lucide-react';

export const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadCaseData(id);
    }
  }, [id]);

  const loadCaseData = async (caseId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.getCaseById(caseId);
      if (res && res.success && res.case) {
        setCaseData(res.case);
        setRelationships(res.relationships || []);
      } else {
        setError('The requested case could not be located in the legal database.');
      }
    } catch (err) {
      // MOCK DATA: development fallback only. Not authoritative legal content.
      setError(err.message || 'Unable to connect to the legal database server.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Retrieving Judgment & Citations...</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Loading verified case records from Supreme Court of India database</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400 shadow-lg">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Case Record Not Found</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {error || 'The case identifier requested does not exist or could not be loaded.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Browse Landmark Cases
          </button>
          <button
            type="button"
            onClick={() => loadCaseData(id)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous view</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/ai-analysis')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/60 transition-colors cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Open in 5-Pillar Analysis</span>
          </button>
        </div>
      </div>

      {/* 1. Header with Citation & Save Button */}
      <CaseHeader caseData={caseData} />

      {/* 2. Executive Summary */}
      <CaseSummary
        summary={caseData.summary}
        holding={caseData.keyHolding}
        decision={caseData.analysis?.decision}
      />

      {/* 3. Facts */}
      <CaseFacts facts={caseData.analysis?.facts || caseData.facts} />

      {/* 4. Legal Principles, Issues & Arguments */}
      <KeyPrinciples analysis={caseData.analysis} />

      {/* 5. Relevance Analysis */}
      <RelevanceAnalysis
        analysis={caseData.analysis}
        relevanceText={caseData.relevanceAnalysis}
      />

      {/* 6. Related Precedent Relationships */}
      <RelatedPrecedents
        relationships={relationships}
        currentCaseId={caseData.id}
      />

      {/* 7. Adjudication & Court Metadata */}
      <CourtInfo caseData={caseData} />
    </div>
  );
};

export default CaseDetails;
