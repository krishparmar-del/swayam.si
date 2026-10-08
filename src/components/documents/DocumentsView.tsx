import React, { useState } from 'react';
import { 
  FolderCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle,
  Building2,
  Lock,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { MASTER_DOCUMENTS } from '../../data/masterDocuments';
import { DocumentReadinessStatus } from '../../types/opportunity';
import { useI18n } from '../../i18n/LanguageContext';

interface DocumentsViewProps {
  docWallet: Record<string, DocumentReadinessStatus>;
  onUpdateStatus: (docId: string, status: DocumentReadinessStatus) => void;
  onFindOpportunities?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ 
  docWallet, 
  onUpdateStatus,
  onFindOpportunities 
}) => {
  const { t } = useI18n();
  const [filter, setFilter] = useState<'all' | 'ready' | 'action_needed' | 'missing' | 'unknown'>('all');
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  // Group definitions
  const docGroups = [
    {
      groupKey: 'IDENTITY',
      title: 'Identity Documents',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'IDENTITY')
    },
    {
      groupKey: 'EDUCATION',
      title: 'Education Documents',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'EDUCATION')
    },
    {
      groupKey: 'CATEGORY_RESERVATION',
      title: 'Category & Reservation',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'CATEGORY_RESERVATION')
    },
    {
      groupKey: 'RESIDENCE_INCOME',
      title: 'Residence & Income',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'RESIDENCE_INCOME')
    },
    {
      groupKey: 'OTHER',
      title: 'Other Application Essentials',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'OTHER')
    }
  ];

  const readyCount = MASTER_DOCUMENTS.filter(d => (docWallet[d.id] || 'missing') === 'ready').length;
  const actionCount = MASTER_DOCUMENTS.filter(d => (docWallet[d.id] || 'missing') === 'action_needed').length;
  const missingCount = MASTER_DOCUMENTS.filter(d => (docWallet[d.id] || 'missing') === 'missing').length;
  const unknownCount = MASTER_DOCUMENTS.filter(d => (docWallet[d.id] || 'missing') === 'unknown').length;

  const handleRunMatching = () => {
    setIsMatchingLoading(true);
    setTimeout(() => {
      setIsMatchingLoading(false);
      if (onFindOpportunities) {
        onFindOpportunities();
      }
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Progress Indicator */}
      <div className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#174B32] flex items-center gap-1">
            <span>Profile</span>
            <span className="text-[#277448]">✓</span>
          </span>
          <span className="text-[#DDD5C3]">→</span>
          <span className="text-[#174B32] bg-white px-2 py-0.5 rounded-md border border-[#BDDBC8]">
            Documents (Active)
          </span>
          <span className="text-[#DDD5C3]">→</span>
          <span className="text-[#7A8C80]">
            Find Opportunities
          </span>
        </div>

        <button
          onClick={handleRunMatching}
          disabled={isMatchingLoading}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#174B32] hover:bg-[#123724] text-white text-xs font-extrabold rounded-lg shadow-2xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
          <span>{isMatchingLoading ? 'Evaluating...' : 'Find My Opportunities'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Page Heading & Subheading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          Your Document Wallet
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 max-w-2xl">
          Tell us which documents you already have. This helps us find opportunities you can actually prepare for.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setFilter(filter === 'ready' ? 'all' : 'ready')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            filter === 'ready' ? 'border-[#174B32] ring-1 ring-[#174B32]' : 'border-[#E8DFCC]'
          }`}
        >
          <div className="flex items-center justify-between text-[#174B32] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C80]">🟢 Have</span>
            <CheckCircle2 className="w-4 h-4 text-[#277448]" />
          </div>
          <div className="text-2xl font-extrabold text-[#174B32] tabular-nums">
            {readyCount}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-0.5">Ready in hand</p>
        </div>

        <div 
          onClick={() => setFilter(filter === 'action_needed' ? 'all' : 'action_needed')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            filter === 'action_needed' ? 'border-[#F2A93B] ring-1 ring-[#F2A93B]' : 'border-[#E8DFCC]'
          }`}
        >
          <div className="flex items-center justify-between text-[#8C6D23] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C80]">🟡 Getting</span>
            <Clock className="w-4 h-4 text-[#8C6D23]" />
          </div>
          <div className="text-2xl font-extrabold text-[#8C6D23] tabular-nums">
            {actionCount}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-0.5">In application process</p>
        </div>

        <div 
          onClick={() => setFilter(filter === 'missing' ? 'all' : 'missing')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            filter === 'missing' ? 'border-[#8A3B3B] ring-1 ring-[#8A3B3B]' : 'border-[#E8DFCC]'
          }`}
        >
          <div className="flex items-center justify-between text-[#8A3B3B] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C80]">🔴 Missing</span>
            <AlertCircle className="w-4 h-4 text-[#8A3B3B]" />
          </div>
          <div className="text-2xl font-extrabold text-[#8A3B3B] tabular-nums">
            {missingCount}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-0.5">Need to apply</p>
        </div>

        <div 
          onClick={() => setFilter(filter === 'unknown' ? 'all' : 'unknown')}
          className={`bg-white border rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${
            filter === 'unknown' ? 'border-[#7A8C80] ring-1 ring-[#7A8C80]' : 'border-[#E8DFCC]'
          }`}
        >
          <div className="flex items-center justify-between text-[#5E6E64] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8C80]">⚪ Not Sure</span>
            <HelpCircle className="w-4 h-4 text-[#5E6E64]" />
          </div>
          <div className="text-2xl font-extrabold text-[#202A24] tabular-nums">
            {unknownCount}
          </div>
          <p className="text-[11px] text-[#6E7E73] mt-0.5">Need to verify</p>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl flex items-center justify-between text-xs text-[#5E6E64]">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#174B32]" />
          <span>SWAYAM.SI tracks availability status only. No sensitive file uploads or scanned certificates are requested or stored on any server.</span>
        </div>
        <span className="text-[11px] font-bold text-[#174B32] hidden sm:inline">100% Client-Side Privacy</span>
      </div>

      {/* Filter reset if filtered */}
      {filter !== 'all' && (
        <div className="flex items-center justify-between p-3 bg-white border border-[#E8DFCC] rounded-xl text-xs">
          <span className="text-[#5E6E64]">
            Filtering by status: <strong className="uppercase">{filter}</strong>
          </span>
          <button
            onClick={() => setFilter('all')}
            className="text-xs font-bold text-[#174B32] hover:underline"
          >
            Show All Documents ({MASTER_DOCUMENTS.length})
          </button>
        </div>
      )}

      {/* Grouped Document List */}
      <div className="space-y-6">
        {docGroups.map((group) => {
          const visibleDocs = group.docs.filter((d) => {
            if (filter === 'all') return true;
            const currentStatus = docWallet[d.id] || 'missing';
            return currentStatus === filter;
          });

          if (visibleDocs.length === 0) return null;

          return (
            <div key={group.groupKey} className="bg-white border border-[#E8DFCC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <h2 className="text-base font-bold text-[#174B32] tracking-tight">
                  {group.title}
                </h2>
                <span className="text-xs font-semibold text-[#7A8C80]">
                  {visibleDocs.length} Documents
                </span>
              </div>

              <div className="divide-y divide-[#F0EBE1]">
                {visibleDocs.map((doc) => {
                  const status = docWallet[doc.id] || 'missing';

                  return (
                    <div key={doc.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#202A24]">
                            {doc.name}
                          </h3>
                          {doc.isMandatory && (
                            <span className="text-[10px] font-bold text-[#8A3B3B] bg-[#FBEAE9] px-2 py-0.5 rounded-md">
                              Essential
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5E6E64] leading-relaxed">
                          {doc.description}
                        </p>
                        {doc.officialIssuingAuthority && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#7A8C80] pt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-[#8C6D23]" />
                            <span>Issuing Authority: {doc.officialIssuingAuthority}</span>
                          </div>
                        )}
                        {doc.howToObtain && (
                          <p className="text-[11px] text-[#7A8C80]">
                            <strong>How to obtain:</strong> {doc.howToObtain}
                          </p>
                        )}
                      </div>

                      {/* Right: Obvious Large 4-State Status Controls */}
                      <div className="grid grid-cols-4 gap-1.5 sm:w-84 shrink-0">
                        {/* 🟢 HAVE */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(doc.id, 'ready')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                            status === 'ready'
                              ? 'bg-[#E2EFE7] text-[#174B32] border-[#277448] shadow-2xs ring-2 ring-[#277448]'
                              : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#EBF5EE]'
                          }`}
                        >
                          <span>🟢 Have</span>
                          <span className="text-[9px] font-normal opacity-80">I have this</span>
                        </button>

                        {/* 🟡 GETTING */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(doc.id, 'action_needed')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                            status === 'action_needed'
                              ? 'bg-[#FEF3D6] text-[#8C6D23] border-[#DDA032] shadow-2xs ring-2 ring-[#DDA032]'
                              : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FEF6E4]'
                          }`}
                        >
                          <span>🟡 Getting</span>
                          <span className="text-[9px] font-normal opacity-80">Applying</span>
                        </button>

                        {/* 🔴 MISSING */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(doc.id, 'missing')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                            status === 'missing'
                              ? 'bg-[#FBEAE9] text-[#8A3B3B] border-[#8A3B3B] shadow-2xs ring-2 ring-[#8A3B3B]'
                              : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FBEAE9]'
                          }`}
                        >
                          <span>🔴 Missing</span>
                          <span className="text-[9px] font-normal opacity-80">Don't have</span>
                        </button>

                        {/* ⚪ NOT SURE */}
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(doc.id, 'unknown')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center border transition-all ${
                            status === 'unknown'
                              ? 'bg-slate-100 text-[#202A24] border-[#7A8C80] shadow-2xs ring-2 ring-[#7A8C80]'
                              : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-slate-100'
                          }`}
                        >
                          <span>⚪ Not sure</span>
                          <span className="text-[9px] font-normal opacity-80">Check later</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Document Verification Completion Card */}
      <div className="bg-[#FAF7EE] border-2 border-[#174B32] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFCC] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#277448] animate-pulse" />
              <h3 className="text-base font-bold text-[#174B32]">
                Your document profile is ready.
              </h3>
            </div>
            <p className="text-xs text-[#5E6E64] mt-0.5">
              Tell us which documents you already have. This helps us find opportunities you can actually prepare for.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
            <span className="px-2.5 py-1 bg-white border border-[#DDD5C3] rounded-lg text-[#202A24]">
              Marked: <strong className="text-[#174B32]">{readyCount + actionCount + missingCount + unknownCount}</strong>/{MASTER_DOCUMENTS.length}
            </span>
            <span className="px-2.5 py-1 bg-[#E2EFE7] border border-[#BDDBC8] rounded-lg text-[#174B32]">
              Have: {readyCount}
            </span>
            <span className="px-2.5 py-1 bg-[#FEF3D6] border border-[#F2A93B] rounded-lg text-[#8C6D23]">
              Getting: {actionCount}
            </span>
            <span className="px-2.5 py-1 bg-[#FBEAE9] border border-[#EAA2A0] rounded-lg text-[#8A3B3B]">
              Missing: {missingCount}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-lg text-[#5E6E64]">
              Not sure: {unknownCount}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <p className="text-xs text-[#5E6E64] max-w-lg">
            We will prioritize examinations and schemes matching your education and document readiness without blocking your exploration.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleRunMatching}
              className="text-xs font-semibold text-[#5E6E64] hover:text-[#174B32] px-3 py-2.5 rounded-xl transition-colors hover:bg-white"
              title="Your matches may be less personalized until you complete your document profile."
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleRunMatching}
              disabled={isMatchingLoading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-[#174B32] hover:bg-[#123724] text-white text-sm font-extrabold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#F2A93B]" />
              <span>{isMatchingLoading ? 'Evaluating criteria...' : 'Find my opportunities'}</span>
              <ArrowRight className="w-4 h-4 text-[#F2A93B]" />
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#7A8C80] text-center sm:text-left italic">
          Tip: You can update your document readiness at any time. Changes will immediately update your eligibility scores.
        </p>
      </div>
    </div>
  );
};
