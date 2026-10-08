import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HelpCircle, 
  Coins, 
  BookOpen, 
  FileCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { Opportunity, DocumentReadinessStatus } from '../../types/opportunity';
import { UserProfile } from '../../types/profile';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { PdfGenerator } from '../../services/pdfGenerator';
import { OpportunityChat } from './OpportunityChat';
import { TrustNotice } from '../common/TrustNotice';
import { useI18n } from '../../i18n/LanguageContext';

interface SchemeDetailViewProps {
  scheme: Opportunity;
  user: UserProfile;
  docWallet: Record<string, DocumentReadinessStatus>;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onUpdateDocStatus: (docId: string, status: DocumentReadinessStatus) => void;
  onUpdateProfileIncome: (income: number) => void;
  onBack: () => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  scheme,
  user,
  docWallet,
  isSaved,
  onToggleSave,
  onUpdateDocStatus,
  onUpdateProfileIncome,
  onBack
}) => {
  const { language, t } = useI18n();
  const [incomeInput, setIncomeInput] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // Selection of documents option (requested by user)
  const [selectedDocIds, setSelectedDocIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    scheme.requiredDocuments.forEach(d => {
      initial[d.id] = true; // default all selected
    });
    return initial;
  });

  const eligibility = EligibilityEngine.evaluate(user, scheme);

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAllDocs = (select: boolean) => {
    const updated: Record<string, boolean> = {};
    scheme.requiredDocuments.forEach(d => {
      updated[d.id] = select;
    });
    setSelectedDocIds(updated);
  };

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      // Filter opportunity documents to only selected ones
      const filteredScheme: Opportunity = {
        ...scheme,
        requiredDocuments: scheme.requiredDocuments.filter(d => selectedDocIds[d.id] !== false)
      };
      PdfGenerator.generateChecklistPdf(user, filteredScheme, eligibility, docWallet);
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(incomeInput);
    if (!isNaN(val) && val >= 0) {
      onUpdateProfileIncome(val);
      setIncomeInput('');
    }
  };

  const title = language === 'hi' && scheme.titleHindi ? scheme.titleHindi : scheme.title;
  const description = language === 'hi' && scheme.fullDescriptionHindi ? scheme.fullDescriptionHindi : scheme.fullDescription;
  const authority = language === 'hi' && scheme.authorityHindi ? scheme.authorityHindi : scheme.authority;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Back & Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#5E6E64] hover:text-[#174B32] py-1.5 px-2.5 rounded-lg hover:bg-[#FAF7EE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(scheme.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              isSaved
                ? 'bg-[#E2EFE7] text-[#174B32] border-[#BDDBC8]'
                : 'bg-white text-[#5E6E64] border-[#E8DFCC] hover:bg-[#FAF7EE]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-[#174B32]" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? t('savedSuccess') : t('saveToWallet')}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isPdfGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#174B32] hover:bg-[#123724] rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#F2A93B]" />
            <span>{isPdfGenerating ? 'Generating...' : 'Download Checklist (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#5E6E64] font-medium flex-wrap">
          <span className="font-semibold text-[#174B32]">{authority}</span>
          <span aria-hidden="true" className="text-[#C5B898]">·</span>
          <span className="capitalize">{scheme.level} Scheme</span>
          <span aria-hidden="true" className="text-[#C5B898]">·</span>
          <span>Beneficiary: <strong className="capitalize text-[#174B32]">{scheme.beneficiaryType || 'Citizen'}</strong></span>
          {scheme.isOfficialSourceVerified && (
            <>
              <span aria-hidden="true" className="text-[#C5B898]">·</span>
              <span className="text-[#277448] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official Source</span>
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-[#4E5D53] leading-relaxed max-w-4xl">
          {description}
        </p>

        {/* Financial Benefit Banner */}
        <div className="p-4 bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl flex items-start gap-3">
          <Coins className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
              Grant / Benefit Details
            </h4>
            <p className="text-sm font-semibold text-[#174B32] mt-0.5">
              {scheme.keyBenefit}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={scheme.applicationUrl || scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#174B32] hover:bg-[#123724] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>{t('viewOfficialApplication')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F2A93B]" />
          </a>

          {scheme.officialUrl && (
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF7EE] text-[#5E6E64] border border-[#DDD5C3] text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <span>Visit Official Scheme Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Trust Notice */}
      <TrustNotice variant="card" />

      {/* Missing Information Prompt (if scheme needs income and user hasn't set it) */}
      {eligibility.missingFields.includes('annualFamilyIncome') && (
        <div className="bg-[#FEF6E4] border border-[#F2DFB3] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#202A24]">
                We need one more detail to evaluate this scheme
              </h3>
              <p className="text-xs text-[#5E6E64] mt-0.5">
                This welfare scheme has an annual family income ceiling (₹{(scheme.eligibilityRequirements.maxFamilyIncome! / 100000).toFixed(1)} Lakhs). Please enter your approximate family income to check eligibility.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveIncome} className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="number"
              placeholder="e.g. 250000"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              className="flex-1 bg-white border border-[#DDD5C3] rounded-xl px-3 py-2 text-xs text-[#202A24] focus:outline-none focus:border-[#1F5A38]"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#174B32] text-white text-xs font-bold rounded-xl hover:bg-[#123724] transition-colors"
            >
              Verify Income
            </button>
          </form>
        </div>
      )}

      {/* 2. ELIGIBILITY IN MULTI-ROW CHECKLIST FORMAT (Requested: not block format, multiple rows with green/yellow/red icons) */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#174B32] tracking-tight">
              {t('doYouQualify')} — Eligibility Checklist
            </h2>
            <p className="text-xs text-[#5E6E64] mt-0.5">
              Multi-row checklist evaluated against your profile.
            </p>
          </div>

          {/* Checklist Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-[#174B32]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#277448] fill-[#277448]/20" /> Met
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#8C6D23]">
              <Clock className="w-3.5 h-3.5 text-[#DDA032] fill-[#DDA032]/20" /> Working
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#8A3B3B]">
              <XCircle className="w-3.5 h-3.5 text-[#8A3B3B] fill-[#8A3B3B]/20" /> Missing
            </span>
          </div>
        </div>

        {/* Multi-Row Checklist Table */}
        <div className="border border-[#E8DFCC] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7EE] border-b border-[#E8DFCC] text-[#174B32] font-bold">
                <th className="py-2.5 px-3 w-12 text-center">Status</th>
                <th className="py-2.5 px-3 w-44">Eligibility Parameter</th>
                <th className="py-2.5 px-3">Your Profile vs Official Criterion</th>
                <th className="py-2.5 px-3 w-28 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {eligibility.checks.map((check, idx) => {
                const isPass = check.status === 'pass';
                const isWorking = check.status === 'missing' || check.status === 'warning';

                return (
                  <tr key={idx} className="hover:bg-[#FAF7EE]/50">
                    <td className="py-3 px-3 text-center">
                      {isPass ? (
                        <CheckCircle2 className="w-5 h-5 text-[#277448] fill-[#277448]/20 mx-auto" />
                      ) : isWorking ? (
                        <Clock className="w-5 h-5 text-[#DDA032] fill-[#DDA032]/20 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#8A3B3B] fill-[#8A3B3B]/20 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#202A24] block">{check.criterion}</span>
                      <span className="text-[11px] text-[#6E7E73]">{check.message}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#3E4D43]">
                        <span>Your value: <strong className="text-[#202A24]">{check.userValue}</strong></span>
                        <span className="mx-2 text-[#C5B898]">·</span>
                        <span>Required: <strong className="text-[#202A24]">{check.requiredValue}</strong></span>
                      </div>
                      {check.detail && (
                        <p className="text-[10px] text-[#7A8C80] mt-0.5">{check.detail}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isPass ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2EFE7] text-[#174B32]">
                          PASS
                        </span>
                      ) : isWorking ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3D6] text-[#8C6D23]">
                          ACTION
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBEAE9] text-[#8A3B3B]">
                          UNMET
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. OPTION IN SCHEMES FOR SELECTION OF DOCUMENTS (Requested by user) */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#277448]" />
              <h2 className="text-xl font-bold text-[#174B32] tracking-tight">
                Scheme Document Selection & Checklist
              </h2>
            </div>
            <p className="text-xs text-[#5E6E64] mt-0.5">
              Select which documents you want to include in your application checklist. Status indicators: 🟢 Available, 🟡 In-Progress, 🔴 Missing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => selectAllDocs(true)}
              className="text-xs font-semibold text-[#174B32] hover:underline px-2"
            >
              Select All
            </button>
            <span className="text-[#C5B898]">|</span>
            <button
              onClick={() => selectAllDocs(false)}
              className="text-xs font-semibold text-[#8A3B3B] hover:underline px-2"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {/* Multi-Row Document Checklist with Select Option & Green/Yellow/Red Icons */}
        <div className="border border-[#E8DFCC] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7EE] border-b border-[#E8DFCC] text-[#174B32] font-bold">
                <th className="py-2.5 px-3 w-10 text-center">Select</th>
                <th className="py-2.5 px-3 w-12 text-center">Status</th>
                <th className="py-2.5 px-3">Required Document Name & Purpose</th>
                <th className="py-2.5 px-3 w-36 text-center">Change State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {scheme.requiredDocuments.map((docItem) => {
                const isSelected = selectedDocIds[docItem.id] !== false;
                const status = docWallet[docItem.id] || 'missing';

                return (
                  <tr 
                    key={docItem.id} 
                    className={`hover:bg-[#FAF7EE]/50 transition-colors ${!isSelected ? 'opacity-50 bg-slate-50' : ''}`}
                  >
                    {/* Checkbox Select Option */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectDoc(docItem.id)}
                        className="text-[#174B32] hover:scale-110 transition-transform focus:outline-none"
                        aria-label={`Select ${docItem.name}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#174B32]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#AABBB0]" />
                        )}
                      </button>
                    </td>

                    {/* Green, Yellow, Red Status Icon */}
                    <td className="py-3 px-3 text-center">
                      {status === 'ready' ? (
                        <div title="Available in Hand">
                          <CheckCircle2 className="w-5 h-5 text-[#277448] fill-[#277448]/20 mx-auto" />
                        </div>
                      ) : status === 'action_needed' ? (
                        <div title="Working on it / Applying">
                          <Clock className="w-5 h-5 text-[#DDA032] fill-[#DDA032]/20 mx-auto" />
                        </div>
                      ) : (
                        <div title="Missing">
                          <XCircle className="w-5 h-5 text-[#8A3B3B] fill-[#8A3B3B]/20 mx-auto" />
                        </div>
                      )}
                    </td>

                    {/* Document Details */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202A24]">{docItem.name}</span>
                        {docItem.isMandatory ? (
                          <span className="text-[10px] font-bold text-[#8A3B3B] bg-[#FBEAE9] px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#5E6E64] bg-[#FAF7EE] px-1.5 py-0.5 rounded">
                            Verification
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5E6E64] mt-0.5">{docItem.description}</p>
                    </td>

                    {/* Quick State Toggle Buttons */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateDocStatus(docItem.id, 'ready')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            status === 'ready'
                              ? 'bg-[#174B32] text-white border-[#174B32]'
                              : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
                          }`}
                          title="Mark Ready"
                        >
                          Have
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateDocStatus(docItem.id, 'action_needed')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            status === 'action_needed'
                              ? 'bg-[#F2A93B] text-[#202A24] border-[#DDA032]'
                              : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
                          }`}
                          title="Mark Applying"
                        >
                          Applying
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateDocStatus(docItem.id, 'missing')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            status === 'missing'
                              ? 'bg-[#8A3B3B] text-white border-[#8A3B3B]'
                              : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
                          }`}
                          title="Mark Missing"
                        >
                          Missing
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[#6E7E73]">
          ✓ Selected documents will be compiled into your personalized PDF checklist download.
        </p>
      </div>

      {/* Synthesized AI Chat for This Scheme */}
      <div className="space-y-2">
        <OpportunityChat
          opportunity={scheme}
          user={user}
        />
      </div>
    </div>
  );
};
