import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { SearchLegalView } from './views/SearchLegalView';
import { ActsLibraryView } from './views/ActsLibraryView';
import { CasesPrecedentsView } from './views/CasesPrecedentsView';
import { AICaseAnalysisView } from './views/AICaseAnalysisView';
import { PrecedentMapView } from './views/PrecedentMapView';
import { LawMappingView } from './views/LawMappingView';
import { CommunityView } from './views/CommunityView';
import { BookmarksHistoryView } from './views/BookmarksHistoryView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseForAnalysis, setSelectedCaseForAnalysis] = useState(null);
  const [focusPrecedentCaseId, setFocusPrecedentCaseId] = useState(null);
  const [selectedActId, setSelectedActId] = useState(null);
  const [selectedMappingId, setSelectedMappingId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGlobalSearchTrigger = (query) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handleAnalyzeCase = (caseObj) => {
    setSelectedCaseForAnalysis(caseObj);
    setActiveTab('ai-analysis');
  };

  const handleOpenPrecedentMap = (caseId) => {
    setFocusPrecedentCaseId(caseId);
    setActiveTab('precedents-map');
  };

  const handleNavigateToSection = (sectionId) => {
    setSelectedActId('act-bns');
    setActiveTab('acts');
  };

  const handleNavigateToCase = (caseId) => {
    setActiveTab('cases');
  };

  const handleNavigateToMapping = (mappingId) => {
    setSelectedMappingId(mappingId);
    setActiveTab('law-mapping');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onSearchTrigger={handleGlobalSearchTrigger}
        onTabChange={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Center View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'search' && (
            <SearchLegalView
              initialQuery={searchQuery}
              onNavigateToCase={handleNavigateToCase}
              onNavigateToSection={handleNavigateToSection}
              onNavigateToMapping={handleNavigateToMapping}
              onAnalyzeCase={handleAnalyzeCase}
            />
          )}

          {activeTab === 'acts' && (
            <ActsLibraryView
              selectedActId={selectedActId}
              onSelectSection={handleNavigateToSection}
            />
          )}

          {activeTab === 'cases' && (
            <CasesPrecedentsView
              onAnalyzeCase={handleAnalyzeCase}
              onOpenPrecedentMap={handleOpenPrecedentMap}
            />
          )}

          {activeTab === 'ai-analysis' && (
            <AICaseAnalysisView targetCase={selectedCaseForAnalysis} />
          )}

          {activeTab === 'precedents-map' && (
            <PrecedentMapView focusCaseId={focusPrecedentCaseId} onSelectCase={handleAnalyzeCase} />
          )}

          {activeTab === 'law-mapping' && (
            <LawMappingView selectedMappingId={selectedMappingId} />
          )}

          {activeTab === 'community' && (
            <CommunityView />
          )}

          {activeTab === 'bookmarks' && (
            <BookmarksHistoryView
              onSearchQuery={handleGlobalSearchTrigger}
              onNavigateToSection={handleNavigateToSection}
              onNavigateToCase={handleNavigateToCase}
            />
          )}
        </main>
      </div>

      {/* Modals & Global Notifications */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
