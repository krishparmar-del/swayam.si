import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  FolderCheck, 
  UserCheck, 
  ArrowRight, 
  Clock, 
  Building2, 
  TrendingUp, 
  Award,
  GraduationCap,
  Landmark,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types/profile';
import { Opportunity, DocumentReadinessStatus, MatchStatus } from '../../types/opportunity';
import { OpportunityCard } from '../opportunities/OpportunityCard';
import { SwayamReveal } from './SwayamReveal';
import { TrustNotice } from '../common/TrustNotice';
import { DynamicSearchIntelligence } from '../opportunities/DynamicSearchIntelligence';
import { useI18n } from '../../i18n/LanguageContext';

interface DashboardViewProps {
  user: UserProfile;
  recommended: Array<{ opportunity: Opportunity; matchScore: number; status: string }>;
  upcomingDeadlines: Opportunity[];
  docWallet: Record<string, DocumentReadinessStatus>;
  completeness: number;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  recommended,
  upcomingDeadlines,
  docWallet,
  completeness,
  onSelectOpportunity,
  onToggleSave,
  onNavigate
}) => {
  const { t } = useI18n();

  // Tab switch: 'recommended_all' | 'recommended_exams' | 'recommended_schemes'
  const [activeTab, setActiveTab] = useState<'recommended' | 'exams' | 'schemes'>('recommended');

  // Compute stats
  const docsReadyCount = Object.values(docWallet).filter(s => s === 'ready').length;
  const totalTrackedDocs = Object.keys(docWallet).length;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? t('greetingMorning') : currentHour < 17 ? t('greetingAfternoon') : t('greetingEvening');

  // Partition recommended items
  const recommendedExams = recommended.filter(r => r.opportunity.type === 'exam');
  const recommendedSchemes = recommended.filter(r => r.opportunity.type === 'scheme');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-150">
      {/* 1. Hero Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {greeting}, {user.name ? user.name.split(' ')[0] : 'Scholar'}!
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6E64] max-w-2xl leading-relaxed">
          {t('heroDashboardSubtitle')}
        </p>
      </div>

      {/* 2. Signature Swayam Reveal Progress Bar */}
      <SwayamReveal
        onComplete={() => {}}
        triggerRecheck={() => {}}
        isCompleted={true}
      />

      {/* 3. Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Potential Matches */}
        <div 
          onClick={() => onNavigate('exams')}
          className="bg-white border border-[#E8DFCC] hover:border-[#174B32]/40 rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-[#8C6D23] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C80]">
              {t('potentialMatches')}
            </span>
            <TrendingUp className="w-4 h-4 text-[#277448]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tabular-nums">
            {recommended.length}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-1">High-relevance options</p>
        </div>

        {/* Stat 2: Upcoming Deadlines */}
        <div 
          onClick={() => onNavigate('exams')}
          className="bg-white border border-[#E8DFCC] hover:border-[#174B32]/40 rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-[#8C6D23] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C80]">
              {t('upcomingDeadlines')}
            </span>
            <Clock className="w-4 h-4 text-[#8C6D23]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tabular-nums">
            {upcomingDeadlines.length}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-1">Active closing windows</p>
        </div>

        {/* Stat 3: Document Wallet */}
        <div 
          onClick={() => onNavigate('documents')}
          className="bg-white border border-[#E8DFCC] hover:border-[#174B32]/40 rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-[#8C6D23] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C80]">
              {t('documentsReady')}
            </span>
            <FolderCheck className="w-4 h-4 text-[#1F5A38]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tabular-nums">
            {docsReadyCount} <span className="text-xs font-normal text-[#7A8C80]">/ {totalTrackedDocs}</span>
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-1">Certificates verified ready</p>
        </div>

        {/* Stat 4: Profile Completeness */}
        <div 
          onClick={() => onNavigate('profile')}
          className="bg-white border border-[#E8DFCC] hover:border-[#174B32]/40 rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-[#8C6D23] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8C80]">
              {t('profileCompleteness')}
            </span>
            <UserCheck className="w-4 h-4 text-[#174B32]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tabular-nums">
            {completeness}%
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-1">{completeness < 100 ? 'Add income to unlock all' : 'Fully matched'}</p>
        </div>
      </div>

      {/* 4. Trust Banner */}
      <TrustNotice variant="banner" />

      {/* 5. Dynamic Opportunity Intelligence (Live Web Grounding) */}
      <DynamicSearchIntelligence
        user={user}
        onSelectOpportunity={onSelectOpportunity}
        onToggleSave={onToggleSave}
      />

      {/* 6. Personalized Opportunities Section with Recommended Exams and Recommended Schemes */}
      <div className="space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#F0EBE1] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2EFE7] text-[#174B32] text-xs font-bold border border-[#BDDBC8] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#277448]" />
              <span>PERSONALIZED MATCH RESULTS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#174B32] tracking-tight">
              Opportunities Matched to Your Profile & Wallet
            </h2>
            <p className="text-xs text-[#5E6E64] mt-0.5">
              Ranked dynamically using education qualification, statutory relaxations, and document readiness.
            </p>
          </div>

          {/* Quick Navigation Switchers (Recommended vs All Exams vs All Schemes) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('exams')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF7EE] text-[#174B32] border border-[#DDD5C3] rounded-xl text-xs font-semibold transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#277448]" />
              <span>All Exams</span>
              <ChevronRight className="w-3 h-3 text-[#7A8C80]" />
            </button>

            <button
              onClick={() => onNavigate('schemes')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF7EE] text-[#174B32] border border-[#DDD5C3] rounded-xl text-xs font-semibold transition-colors"
            >
              <Landmark className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>All Schemes</span>
              <ChevronRight className="w-3 h-3 text-[#7A8C80]" />
            </button>
          </div>
        </div>

        {/* Section A: Recommended Exams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E2EFE7] text-[#174B32] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4 text-[#277448]" />
              </div>
              <h3 className="text-lg font-bold text-[#174B32] tracking-tight">
                Recommended Exams ({recommendedExams.length})
              </h3>
            </div>

            <button
              onClick={() => onNavigate('exams')}
              className="flex items-center gap-1 text-xs font-bold text-[#174B32] hover:underline"
            >
              <span>Explore All Exams</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedExams.slice(0, 4).map(({ opportunity, matchScore, status }) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                matchScore={matchScore}
                matchStatus={status as MatchStatus}
                isSaved={user.savedOpportunityIds.includes(opportunity.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </div>

        {/* Section B: Recommended Schemes */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FEF3D6] text-[#8C6D23] flex items-center justify-center font-bold">
                <Landmark className="w-4 h-4 text-[#8C6D23]" />
              </div>
              <h3 className="text-lg font-bold text-[#174B32] tracking-tight">
                Recommended Welfare Schemes & Scholarships ({recommendedSchemes.length})
              </h3>
            </div>

            <button
              onClick={() => onNavigate('schemes')}
              className="flex items-center gap-1 text-xs font-bold text-[#8C6D23] hover:underline"
            >
              <span>Explore All Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedSchemes.slice(0, 4).map(({ opportunity, matchScore, status }) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                matchScore={matchScore}
                matchStatus={status as MatchStatus}
                isSaved={user.savedOpportunityIds.includes(opportunity.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectOpportunity}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 7. Upcoming Deadlines Widget */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8C6D23]" />
              <h3 className="text-base font-bold text-[#174B32] tracking-tight">
                Crucial Application Deadlines
              </h3>
            </div>
            <span className="text-xs text-[#5E6E64]">Closing within 90 days</span>
          </div>

          <div className="divide-y divide-[#F0EBE1]">
            {upcomingDeadlines.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectOpportunity(item)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF7EE] px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#202A24]">{item.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#5E6E64] mt-0.5">
                    <span>{item.authority}</span>
                    <span aria-hidden="true" className="text-[#C5B898]">·</span>
                    <span className="capitalize">{item.level}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#8C6D23] block tabular-nums">
                    {item.deadline ? new Date(item.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open'}
                  </span>
                  <span className="text-[10px] text-[#7A8C80]">Official Portal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
