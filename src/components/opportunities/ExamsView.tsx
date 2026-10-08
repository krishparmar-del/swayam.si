import React, { useState, useMemo } from 'react';
import { Search, Filter, Activity, Sparkles, Building2, Check } from 'lucide-react';
import { Opportunity, MatchStatus } from '../../types/opportunity';
import { UserProfile } from '../../types/profile';
import { OpportunityCard } from './OpportunityCard';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { useI18n } from '../../i18n/LanguageContext';

interface ExamsViewProps {
  exams: Opportunity[];
  user: UserProfile;
  onSelectExam: (exam: Opportunity) => void;
  onToggleSave: (id: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({
  exams,
  user,
  onSelectExam,
  onToggleSave
}) => {
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'central' | 'state'>('all');
  const [physicalOnly, setPhysicalOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'recommended'>('all');

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Level
      if (levelFilter !== 'all' && exam.level !== levelFilter) return false;
      // Physical
      if (physicalOnly && !exam.eligibilityRequirements.requiresPhysical) return false;
      // Tab
      if (activeTab === 'upcoming' && exam.status !== 'upcoming' && exam.status !== 'open') return false;
      if (activeTab === 'recommended') {
        const evalRes = EligibilityEngine.evaluate(user, exam);
        if (evalRes.status !== 'ELIGIBLE' && evalRes.status !== 'POSSIBLY_ELIGIBLE') return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = exam.title.toLowerCase().includes(q) || (exam.titleHindi && exam.titleHindi.toLowerCase().includes(q));
        const matchesAuth = exam.authority.toLowerCase().includes(q);
        const matchesTags = exam.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesAuth && !matchesTags) return false;
      }
      return true;
    });
  }, [exams, levelFilter, physicalOnly, activeTab, search, user]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {t('examsPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 max-w-2xl">
          {t('examsPageSubtitle')}
        </p>
      </div>

      {/* Filter and Search Bar Controls (Design System: functional button controls, clean background) */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name, commission, qualification or department..."
            className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Level Filter (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                levelFilter === 'all' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setLevelFilter('central')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                levelFilter === 'central' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              {t('centralFilter')}
            </button>
            <button
              onClick={() => setLevelFilter('state')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                levelFilter === 'state' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              {t('stateFilter')} ({user.state || 'State'})
            </button>
          </div>

          {/* Physical Requirement and Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhysicalOnly(!physicalOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                physicalOnly
                  ? 'bg-[#E2EFE7] text-[#174B32] border-[#BDDBC8]'
                  : 'bg-white text-[#5E6E64] border-[#E0D8C5] hover:bg-[#FAF7EE]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t('physicalFilter')}</span>
            </button>

            {(levelFilter !== 'all' || physicalOnly || search) && (
              <button
                onClick={() => {
                  setLevelFilter('all');
                  setPhysicalOnly(false);
                  setSearch('');
                }}
                className="text-xs font-semibold text-[#8A3B3B] hover:underline px-2"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((exam) => {
            const evalResult = EligibilityEngine.evaluate(user, exam);
            return (
              <OpportunityCard
                key={exam.id}
                opportunity={exam}
                matchScore={evalResult.matchScore}
                matchStatus={evalResult.status}
                isSaved={user.savedOpportunityIds.includes(exam.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectExam}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E8DFCC] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-[#5E6E64]">
            {t('noExamsFound')}
          </p>
          <button
            onClick={() => {
              setLevelFilter('all');
              setPhysicalOnly(false);
              setSearch('');
            }}
            className="px-4 py-2 bg-[#174B32] text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
