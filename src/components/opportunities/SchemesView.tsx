import React, { useState, useMemo } from 'react';
import { Search, Filter, Landmark, GraduationCap, Users, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Opportunity, DocumentReadinessStatus } from '../../types/opportunity';
import { UserProfile } from '../../types/profile';
import { MASTER_DOCUMENTS } from '../../data/masterDocuments';
import { OpportunityCard } from './OpportunityCard';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { useI18n } from '../../i18n/LanguageContext';

interface SchemesViewProps {
  schemes: Opportunity[];
  user: UserProfile;
  docWallet?: Record<string, DocumentReadinessStatus>;
  onSelectScheme: (scheme: Opportunity) => void;
  onToggleSave: (id: string) => void;
  onUpdateDocStatus?: (docId: string, status: DocumentReadinessStatus) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  schemes,
  user,
  docWallet = {},
  onSelectScheme,
  onToggleSave,
  onUpdateDocStatus
}) => {
  const { t } = useI18n();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'central' | 'state'>('all');
  const [beneficiaryFilter, setBeneficiaryFilter] = useState<'all' | 'student' | 'youth' | 'women'>('all');
  
  // Document selection filter options (requested by user)
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const [onlyReadyDocs, setOnlyReadyDocs] = useState<boolean>(false);

  // High-demand government welfare documents for quick filter tags
  const popularDocFilters = [
    { id: 'income_certificate', label: 'Income Certificate' },
    { id: 'domicile_certificate', label: 'Domicile Certificate' },
    { id: 'caste_certificate', label: 'Caste Certificate' },
    { id: 'aadhaar_card', label: 'Aadhaar Card' }
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      if (levelFilter !== 'all' && scheme.level !== levelFilter) return false;
      if (beneficiaryFilter !== 'all' && scheme.beneficiaryType !== beneficiaryFilter) return false;
      
      // Filter: Only schemes where user has all required documents
      if (onlyReadyDocs) {
        const hasAllReady = scheme.requiredDocuments.every(
          d => (docWallet[d.id] || 'missing') === 'ready'
        );
        if (!hasAllReady) return false;
      }

      // Specific Document selection filter
      if (selectedDocFilter !== 'all') {
        const hasDoc = scheme.requiredDocuments.some(d => d.id === selectedDocFilter);
        if (!hasDoc) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = scheme.title.toLowerCase().includes(q) || (scheme.titleHindi && scheme.titleHindi.toLowerCase().includes(q));
        const matchesAuth = scheme.authority.toLowerCase().includes(q);
        const matchesTags = scheme.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesAuth && !matchesTags) return false;
      }
      return true;
    });
  }, [schemes, levelFilter, beneficiaryFilter, selectedDocFilter, onlyReadyDocs, search, docWallet]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {t('schemesPageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 max-w-2xl">
          {t('schemesPageSubtitle')}
        </p>
      </div>

      {/* Filter and Search Bar with Document Selection Options */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search welfare schemes, DBT subsidies, or scholarships..."
            className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
          />
        </div>

        {/* Filter controls row 1 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Beneficiary tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl">
            <button
              onClick={() => setBeneficiaryFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                beneficiaryFilter === 'all' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              All Beneficiaries
            </button>
            <button
              onClick={() => setBeneficiaryFilter('student')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                beneficiaryFilter === 'student' ? 'bg-[#174B32] text-white shadow-2xs' : 'text-[#5E6E64] hover:text-[#202A24]'
              }`}
            >
              {t('studentsFilter')}
            </button>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLevelFilter(levelFilter === 'central' ? 'all' : 'central')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                levelFilter === 'central'
                  ? 'bg-[#E2EFE7] text-[#174B32] border-[#BDDBC8]'
                  : 'bg-white text-[#5E6E64] border-[#E0D8C5] hover:bg-[#FAF7EE]'
              }`}
            >
              {t('centralFilter')}
            </button>
            <button
              onClick={() => setLevelFilter(levelFilter === 'state' ? 'all' : 'state')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                levelFilter === 'state'
                  ? 'bg-[#E2EFE7] text-[#174B32] border-[#BDDBC8]'
                  : 'bg-white text-[#5E6E64] border-[#E0D8C5] hover:bg-[#FAF7EE]'
              }`}
            >
              {t('stateFilter')} ({user.state})
            </button>
          </div>
        </div>

        {/* Document Selection Section (Requested by user) */}
        <div className="pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174B32] shrink-0 mr-1">
              <FileCheck className="w-4 h-4 text-[#277448]" />
              <span>Select Document:</span>
            </div>

            {/* Quick Document Pills */}
            <button
              onClick={() => {
                setSelectedDocFilter('all');
                setOnlyReadyDocs(false);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                selectedDocFilter === 'all' && !onlyReadyDocs
                  ? 'bg-[#174B32] text-white border-[#174B32]'
                  : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#F2ECE1]'
              }`}
            >
              Any Document
            </button>

            {popularDocFilters.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDocFilter(selectedDocFilter === doc.id ? 'all' : doc.id);
                  setOnlyReadyDocs(false);
                }}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                  selectedDocFilter === doc.id
                    ? 'bg-[#174B32] text-white border-[#174B32]'
                    : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
                }`}
              >
                {doc.label}
              </button>
            ))}

            {/* Document Select Dropdown */}
            <select
              value={selectedDocFilter}
              onChange={(e) => {
                setSelectedDocFilter(e.target.value);
                setOnlyReadyDocs(false);
              }}
              className="bg-[#FAF7EE] border border-[#DDD5C3] rounded-lg px-2.5 py-1 text-xs text-[#202A24] focus:outline-none focus:border-[#1F5A38]"
            >
              <option value="all">More Documents...</option>
              {MASTER_DOCUMENTS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle: Ready to apply with all documents in wallet */}
          <button
            onClick={() => setOnlyReadyDocs(!onlyReadyDocs)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
              onlyReadyDocs
                ? 'bg-[#E2EFE7] text-[#174B32] border-[#277448] shadow-2xs'
                : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyReadyDocs ? 'text-[#277448]' : 'text-[#7A8C80]'}`} />
            <span>Ready with All My Documents</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchemes.map((scheme) => {
            const evalResult = EligibilityEngine.evaluate(user, scheme);
            return (
              <OpportunityCard
                key={scheme.id}
                opportunity={scheme}
                matchScore={evalResult.matchScore}
                matchStatus={evalResult.status}
                isSaved={user.savedOpportunityIds.includes(scheme.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectScheme}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E8DFCC] rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-[#5E6E64]">
            {t('noSchemesFound')}
          </p>
          <button
            onClick={() => {
              setLevelFilter('all');
              setBeneficiaryFilter('all');
              setSelectedDocFilter('all');
              setOnlyReadyDocs(false);
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
