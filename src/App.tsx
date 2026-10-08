/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useI18n } from './i18n/LanguageContext';
import { UserProfile, INITIAL_USER_PROFILE, PhysicalMeasurements } from './types/profile';
import { Opportunity, DocumentReadinessStatus } from './types/opportunity';
import { ProfileService } from './services/profileService';
import { OpportunityService } from './services/opportunityService';
import { AppLayout } from './components/layout/AppLayout';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { IntentModal } from './components/onboarding/IntentModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExamsView } from './components/opportunities/ExamsView';
import { SchemesView } from './components/opportunities/SchemesView';
import { ExamDetailView } from './components/opportunities/ExamDetailView';
import { SchemeDetailView } from './components/opportunities/SchemeDetailView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ProfileView } from './components/profile/ProfileView';
import { FaqView } from './components/faq/FaqView';
import { AuditReportView } from './components/audit/AuditReportView';
import { AuditReportModal } from './components/audit/AuditReportModal';
import { ExamCentersMapView } from './components/opportunities/ExamCentersMapView';

function SwayamApp() {
  const [user, setUser] = useState<UserProfile>(() => ProfileService.getProfile());
  const [docWallet, setDocWallet] = useState<Record<string, DocumentReadinessStatus>>(() => ProfileService.getDocumentWallet());
  
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Loaded Data
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [recommended, setRecommended] = useState<Array<{ opportunity: Opportunity; matchScore: number; status: string }>>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Opportunity[]>([]);

  // Load opportunities & recommendations
  useEffect(() => {
    async function loadData() {
      const ops = await OpportunityService.getAll();
      setAllOpportunities(ops);

      const recs = await OpportunityService.getRecommended(user, 4);
      setRecommended(recs);

      const deadlines = await OpportunityService.getUpcomingDeadlines(4);
      setUpcomingDeadlines(deadlines);
    }
    loadData();
  }, [user]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (updatedData: Partial<UserProfile>, updatedWallet?: Record<string, DocumentReadinessStatus>) => {
    const updated = ProfileService.saveProfile({
      ...updatedData,
      isOnboarded: true,
    });
    setUser(updated);
    if (updatedWallet) {
      setDocWallet(updatedWallet);
    }
    setCurrentView('home');
  };

  // Handle Intent Selection
  const handleSelectIntent = (intent: 'exams' | 'schemes' | 'both') => {
    setShowIntentModal(false);
    ProfileService.saveProfile({ primaryIntent: intent });
    if (intent === 'exams') {
      setCurrentView('exams');
    } else if (intent === 'schemes') {
      setCurrentView('schemes');
    } else {
      setCurrentView('home');
    }
  };

  // Save / Bookmark Toggle
  const handleToggleSave = (id: string) => {
    const updatedIds = ProfileService.toggleSavedOpportunity(id);
    setUser(prev => ({ ...prev, savedOpportunityIds: updatedIds }));
  };

  // Update Document Readiness
  const handleUpdateDocStatus = (docId: string, status: DocumentReadinessStatus) => {
    const updatedWallet = ProfileService.setDocumentStatus(docId, status);
    setDocWallet(updatedWallet);
  };

  // Update User Profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const saved = ProfileService.saveProfile(updated);
    setUser(saved);
  };

  // Update Income on Scheme prompt
  const handleUpdateProfileIncome = (income: number) => {
    const saved = ProfileService.saveProfile({ annualFamilyIncome: income });
    setUser(saved);
  };

  // Save Physical Measurements
  const handleSavePhysical = (measurements: PhysicalMeasurements) => {
    const saved = ProfileService.saveProfile({ physicalMeasurements: measurements });
    setUser(saved);
  };

  // Reset Local Data
  const handleResetData = () => {
    ProfileService.resetProfile();
    setUser(INITIAL_USER_PROFILE);
    setDocWallet(ProfileService.getDocumentWallet());
    setCurrentView('home');
    setSelectedOpportunity(null);
  };

  // Navigation handler
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedOpportunity(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Opportunity Detail
  const handleSelectOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    if (opportunity.type === 'exam') {
      setCurrentView('exam-detail');
    } else {
      setCurrentView('scheme-detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user has not completed onboarding, show friendly Onboarding
  if (!user.isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const exams = allOpportunities.filter(o => o.type === 'exam');
  const schemes = allOpportunities.filter(o => o.type === 'scheme');
  const completeness = ProfileService.calculateCompleteness(user);

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      user={user}
      searchQuery={searchQuery}
      onOpenAuditModal={() => setShowAuditModal(true)}
      onSearchChange={(q) => {
        setSearchQuery(q);
        if (q.trim() && currentView !== 'exams' && currentView !== 'schemes') {
          setCurrentView('exams');
        }
      }}
    >
      {/* Instant System Audit Checklist Modal (Zero-freeze) */}
      <AuditReportModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onNavigateToFullAudit={() => {
          setShowAuditModal(false);
          handleNavigate('audit');
        }}
      />

      {/* Intent Selection Modal */}
      <IntentModal
        isOpen={showIntentModal}
        onSelectIntent={handleSelectIntent}
      />

      {/* View Routing */}
      {currentView === 'home' && (
        <DashboardView
          user={user}
          recommended={recommended}
          upcomingDeadlines={upcomingDeadlines}
          docWallet={docWallet}
          completeness={completeness}
          onSelectOpportunity={handleSelectOpportunity}
          onToggleSave={handleToggleSave}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'exams' && (
        <ExamsView
          exams={exams}
          user={user}
          onSelectExam={handleSelectOpportunity}
          onToggleSave={handleToggleSave}
        />
      )}

      {currentView === 'schemes' && (
        <SchemesView
          schemes={schemes}
          user={user}
          docWallet={docWallet}
          onSelectScheme={handleSelectOpportunity}
          onToggleSave={handleToggleSave}
          onUpdateDocStatus={handleUpdateDocStatus}
        />
      )}

      {currentView === 'exam-detail' && selectedOpportunity && (
        <ExamDetailView
          exam={selectedOpportunity}
          user={user}
          docWallet={docWallet}
          isSaved={user.savedOpportunityIds.includes(selectedOpportunity.id)}
          onToggleSave={handleToggleSave}
          onUpdateDocStatus={handleUpdateDocStatus}
          onSavePhysicalMeasurements={handleSavePhysical}
          onBack={() => handleNavigate('exams')}
        />
      )}

      {currentView === 'scheme-detail' && selectedOpportunity && (
        <SchemeDetailView
          scheme={selectedOpportunity}
          user={user}
          docWallet={docWallet}
          isSaved={user.savedOpportunityIds.includes(selectedOpportunity.id)}
          onToggleSave={handleToggleSave}
          onUpdateDocStatus={handleUpdateDocStatus}
          onUpdateProfileIncome={handleUpdateProfileIncome}
          onBack={() => handleNavigate('schemes')}
        />
      )}

      {currentView === 'documents' && (
        <DocumentsView
          docWallet={docWallet}
          onUpdateStatus={handleUpdateDocStatus}
          onFindOpportunities={() => handleNavigate('home')}
        />
      )}

      {currentView === 'profile' && (
        <ProfileView
          user={user}
          completeness={completeness}
          onUpdateProfile={handleUpdateProfile}
          onResetData={handleResetData}
          onSelectOpportunity={handleSelectOpportunity}
          onToggleSave={handleToggleSave}
        />
      )}

      {currentView === 'faq' && <FaqView />}

      {currentView === 'centers' && <ExamCentersMapView />}

      {currentView === 'audit' && <AuditReportView />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SwayamApp />
    </LanguageProvider>
  );
}
