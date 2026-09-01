import React, { useState } from 'react';
import { Routes, Route, Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Dashboard } from './pages/Dashboard';
import { LawComparison } from './pages/LawComparison';
import { CaseDetails } from './pages/CaseDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

// Views
import { SearchLegalView } from './views/SearchLegalView';
import { ActsLibraryView } from './views/ActsLibraryView';
import { CasesPrecedentsView } from './views/CasesPrecedentsView';
import { AICaseAnalysisView } from './views/AICaseAnalysisView';
import { PrecedentMapView } from './views/PrecedentMapView';
import { LawMappingView } from './views/LawMappingView';
import { CommunityView } from './views/CommunityView';
import { BookmarksHistoryView } from './views/BookmarksHistoryView';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Extract the active route name (excluding leading '/')
  const activeTab = location.pathname.substring(1) || 'dashboard';

  const [selectedCaseForAnalysis, setSelectedCaseForAnalysis] = useState(null);
  const [focusPrecedentCaseId, setFocusPrecedentCaseId] = useState(null);
  const [selectedActId, setSelectedActId] = useState(null);
  const [selectedMappingId, setSelectedMappingId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGlobalSearchTrigger = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleAnalyzeCase = (caseObj) => {
    setSelectedCaseForAnalysis(caseObj);
    navigate('/ai-analysis');
  };

  const handleOpenPrecedentMap = (caseId) => {
    setFocusPrecedentCaseId(caseId);
    navigate('/precedents-map');
  };

  const handleNavigateToSection = (sectionId) => {
    setSelectedActId('act-bns');
    navigate('/acts');
  };

  const handleNavigateToCase = (caseId) => {
    navigate(caseId ? `/case/${caseId}` : '/cases');
  };

  const handleNavigateToMapping = (mappingId) => {
    setSelectedMappingId(mappingId);
    navigate('/law-comparison');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Navigation */}
      <Navbar
        onSearchTrigger={handleGlobalSearchTrigger}
        onTabChange={(tab) => navigate(`/${tab}`)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={(tab) => navigate(`/${tab}`)} />

        {/* Dynamic Center View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            {/* Core Specs Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/law-comparison" element={<LawComparison />} />
            
            <Route path="/case/:id" element={<CaseDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/search" element={
              <SearchLegalView
                initialQuery={searchParams.get('q') || ''}
                onNavigateToCase={handleNavigateToCase}
                onNavigateToSection={handleNavigateToSection}
                onNavigateToMapping={handleNavigateToMapping}
                onAnalyzeCase={handleAnalyzeCase}
              />
            } />

            <Route path="/saved" element={
              <BookmarksHistoryView
                onSearchQuery={handleGlobalSearchTrigger}
                onNavigateToSection={handleNavigateToSection}
                onNavigateToCase={handleNavigateToCase}
              />
            } />

            <Route path="/history" element={
              <BookmarksHistoryView
                onSearchQuery={handleGlobalSearchTrigger}
                onNavigateToSection={handleNavigateToSection}
                onNavigateToCase={handleNavigateToCase}
              />
            } />

            {/* Preserved Feature Views */}
            <Route path="/acts" element={
              <ActsLibraryView
                selectedActId={selectedActId}
                onSelectSection={handleNavigateToSection}
              />
            } />

            <Route path="/cases" element={
              <CasesPrecedentsView
                onAnalyzeCase={handleAnalyzeCase}
                onOpenPrecedentMap={handleOpenPrecedentMap}
              />
            } />

            <Route path="/ai-analysis" element={
              <AICaseAnalysisView targetCase={selectedCaseForAnalysis} />
            } />

            <Route path="/precedents-map" element={
              <PrecedentMapView focusCaseId={focusPrecedentCaseId} onSelectCase={handleAnalyzeCase} />
            } />

            <Route path="/law-mapping" element={
              <LawMappingView selectedMappingId={selectedMappingId} />
            } />

            <Route path="/community" element={
              <CommunityView />
            } />

            <Route path="/bookmarks" element={
              <BookmarksHistoryView
                onSearchQuery={handleGlobalSearchTrigger}
                onNavigateToSection={handleNavigateToSection}
                onNavigateToCase={handleNavigateToCase}
              />
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
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


