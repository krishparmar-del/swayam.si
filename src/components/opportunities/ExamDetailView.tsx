import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HelpCircle, 
  FileText, 
  PlayCircle, 
  Activity, 
  Building2, 
  ShieldCheck,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Opportunity, DocumentReadinessStatus } from '../../types/opportunity';
import { UserProfile, PhysicalMeasurements } from '../../types/profile';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { PdfGenerator } from '../../services/pdfGenerator';
import { PhysicalRequirementsModal } from './PhysicalRequirementsModal';
import { OpportunityChat } from './OpportunityChat';
import { TrustNotice } from '../common/TrustNotice';
import { useI18n } from '../../i18n/LanguageContext';

interface ExamDetailViewProps {
  exam: Opportunity;
  user: UserProfile;
  docWallet: Record<string, DocumentReadinessStatus>;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onUpdateDocStatus: (docId: string, status: DocumentReadinessStatus) => void;
  onSavePhysicalMeasurements: (measurements: PhysicalMeasurements) => void;
  onBack: () => void;
}

export const ExamDetailView: React.FC<ExamDetailViewProps> = ({
  exam,
  user,
  docWallet,
  isSaved,
  onToggleSave,
  onUpdateDocStatus,
  onSavePhysicalMeasurements,
  onBack
}) => {
  const { language, t } = useI18n();
  const [showPhysicalModal, setShowPhysicalModal] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const eligibility = EligibilityEngine.evaluate(user, exam);

  const handleDownloadPdf = () => {
    setIsPdfGenerating(true);
    try {
      PdfGenerator.generateChecklistPdf(user, exam, eligibility, docWallet);
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const title = language === 'hi' && exam.titleHindi ? exam.titleHindi : exam.title;
  const description = language === 'hi' && exam.fullDescriptionHindi ? exam.fullDescriptionHindi : exam.fullDescription;
  const authority = language === 'hi' && exam.authorityHindi ? exam.authorityHindi : exam.authority;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#5E6E64] hover:text-[#174B32] py-1.5 px-2.5 rounded-lg hover:bg-[#FAF7EE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(exam.id)}
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

      {/* Hero Header Card */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs text-[#5E6E64] font-medium flex-wrap">
          <span className="font-semibold text-[#174B32]">{authority}</span>
          <span aria-hidden="true" className="text-[#C5B898]">·</span>
          <span className="capitalize">{exam.level} Government</span>
          <span aria-hidden="true" className="text-[#C5B898]">·</span>
          <span>Status: <strong className="text-[#174B32] uppercase">{exam.status}</strong></span>
          {exam.isLiveDiscovered ? (
            <>
              <span aria-hidden="true" className="text-[#C5B898]">·</span>
              <span className="text-[#8C6D23] font-bold flex items-center gap-1 bg-[#FEF3D6] px-2 py-0.5 rounded">
                <Globe className="w-3 h-3 text-[#DDA032]" />
                <span>Live Grounded Discovery</span>
              </span>
            </>
          ) : exam.isOfficialSourceVerified ? (
            <>
              <span aria-hidden="true" className="text-[#C5B898]">·</span>
              <span className="text-[#277448] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official Source</span>
              </span>
            </>
          ) : null}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-[#4E5D53] leading-relaxed max-w-4xl">
          {description}
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href={exam.applicationUrl || exam.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#174B32] hover:bg-[#123724] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>{t('viewOfficialApplication')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F2A93B]" />
          </a>

          {exam.notificationUrl && (
            <a
              href={exam.notificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF7EE] hover:bg-[#F2ECE0] text-[#174B32] border border-[#DDD5C3] text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>{t('viewOfficialNotification')}</span>
            </a>
          )}

          {exam.tutorial ? (
            <a
              href={exam.tutorial.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF7EE] text-[#5E6E64] border border-[#DDD5C3] text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#8A3B3B]" />
              <span>{t('watchTutorial')}</span>
            </a>
          ) : (
            <span className="text-xs text-[#7A8C80] px-3 py-2 bg-[#FAF7EE] rounded-xl border border-[#EDE6D6]">
              {t('tutorialComingSoon')}
            </span>
          )}
        </div>
      </div>

      {/* Trust Notice */}
      <TrustNotice variant="card" />

      {/* 2. DO YOU QUALIFY? MULTI-ROW CHECKLIST FORMAT (Requested: not block format, multiple rows with green/yellow/red icons) */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#174B32] tracking-tight">
              {t('doYouQualify')} — Eligibility Checklist
            </h2>
            <p className="text-xs text-[#5E6E64] mt-0.5">
              Multi-row rule evaluation comparing your profile with published criteria.
            </p>
          </div>

          {/* Status Indicator Legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-[#174B32]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#277448] fill-[#277448]/20" /> 🟢 Met
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#8C6D23]">
              <Clock className="w-3.5 h-3.5 text-[#DDA032] fill-[#DDA032]/20" /> 🟡 Action Needed
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#8A3B3B]">
              <XCircle className="w-3.5 h-3.5 text-[#8A3B3B] fill-[#8A3B3B]/20" /> 🔴 Below Standard
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

        {/* Physical requirement check action if required */}
        {exam.eligibilityRequirements.requiresPhysical && exam.physicalRequirements && (
          <div className="p-4 bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#8C6D23]" />
              <div>
                <h4 className="text-xs font-bold text-[#202A24]">Physical Fitness Standard Check</h4>
                <p className="text-xs text-[#5E6E64]">Verify your height, chest expansion, and vision standard before applying.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPhysicalModal(true)}
              className="px-4 py-2 text-xs font-bold text-[#174B32] bg-white border border-[#DDD5C3] hover:bg-[#FAF7EE] rounded-xl transition-colors shrink-0"
            >
              Check My Measurements
            </button>
          </div>
        )}
      </div>

      {/* 3. REQUIRED DOCUMENTS MULTI-ROW CHECKLIST */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[#174B32] tracking-tight">
            Required Documents Checklist
          </h2>
          <p className="text-xs text-[#5E6E64] mt-0.5">
            Status indicators: 🟢 Available in Hand, 🟡 Applying, 🔴 Missing.
          </p>
        </div>

        <div className="border border-[#E8DFCC] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7EE] border-b border-[#E8DFCC] text-[#174B32] font-bold">
                <th className="py-2.5 px-3 w-12 text-center">Status</th>
                <th className="py-2.5 px-3">Document Name & Purpose</th>
                <th className="py-2.5 px-3 w-32 text-center">Wallet State</th>
                <th className="py-2.5 px-3 w-36 text-center">Update State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {exam.requiredDocuments.map((docItem) => {
                const status = docWallet[docItem.id] || 'missing';

                return (
                  <tr key={docItem.id} className="hover:bg-[#FAF7EE]/50">
                    <td className="py-3 px-3 text-center">
                      {status === 'ready' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#277448] fill-[#277448]/20 mx-auto" />
                      ) : status === 'action_needed' ? (
                        <Clock className="w-5 h-5 text-[#DDA032] fill-[#DDA032]/20 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[#8A3B3B] fill-[#8A3B3B]/20 mx-auto" />
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202A24]">{docItem.name}</span>
                        {docItem.isMandatory ? (
                          <span className="text-[10px] font-bold text-[#8A3B3B] bg-[#FBEAE9] px-1.5 py-0.5 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#5E6E64] bg-[#FAF7EE] px-1.5 py-0.5 rounded">
                            Relaxation
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5E6E64] mt-0.5">{docItem.description}</p>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        status === 'ready'
                          ? 'bg-[#E2EFE7] text-[#174B32]'
                          : status === 'action_needed'
                          ? 'bg-[#FEF3D6] text-[#8C6D23]'
                          : 'bg-[#FBEAE9] text-[#8A3B3B]'
                      }`}>
                        {status === 'ready' ? 'AVAILABLE' : status === 'action_needed' ? 'APPLYING' : 'MISSING'}
                      </span>
                    </td>

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
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateDocStatus(docItem.id, 'missing')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            status === 'missing'
                              ? 'bg-[#8A3B3B] text-white border-[#8A3B3B]'
                              : 'bg-white text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FAF7EE]'
                          }`}
                        >
                          Miss
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SOURCE VERIFICATION PANEL (For Live Discovered & Grounded Results) */}
      {exam.sources && exam.sources.length > 0 && (
        <div className="bg-white border border-[#E8DFCC] rounded-2xl p-5 shadow-xs space-y-3">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between text-xs font-bold text-[#174B32]"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#277448]" />
              <span>Where did this information come from? ({exam.sources.length} Verified Sources)</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`} />
          </button>

          {showSources && (
            <div className="pt-2 border-t border-[#F0EBE1] space-y-2 animate-in fade-in">
              {exam.sources.map((src, sIdx) => (
                <div key={sIdx} className="p-2.5 bg-[#FAF7EE] border border-[#EDE6D6] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#202A24]">{src.title}</strong>
                      {src.isOfficial ? (
                        <span className="text-[10px] font-bold text-[#174B32] bg-[#E2EFE7] px-1.5 py-0.2 rounded">
                          OFFICIAL SOURCE (.GOV.IN)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#8C6D23] bg-[#FEF3D6] px-1.5 py-0.2 rounded">
                          SECONDARY CITATION
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#7A8C80]">{src.domain} · Checked {src.dateChecked}</span>
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#174B32] hover:text-[#123724] font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. OFFICIAL EXCERPT ACCORDION */}
      {exam.officialExcerpt && (
        <details className="group bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl p-5 cursor-pointer">
          <summary className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider flex items-center justify-between">
            <span>{t('officialWording')}</span>
            <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 pt-3 border-t border-[#E8DFCC] text-xs text-[#4E5D53] leading-relaxed font-serif italic">
            "{exam.officialExcerpt}"
          </div>
        </details>
      )}

      {/* Synthesized AI Chat for This Exam */}
      <div className="space-y-2">
        <OpportunityChat
          opportunity={exam}
          user={user}
        />
      </div>

      {/* Physical Requirements Modal */}
      {exam.physicalRequirements && (
        <PhysicalRequirementsModal
          isOpen={showPhysicalModal}
          onClose={() => setShowPhysicalModal(false)}
          requirement={exam.physicalRequirements}
          currentMeasurements={user.physicalMeasurements}
          gender={user.gender || 'Male'}
          onSaveMeasurements={(m) => {
            onSavePhysicalMeasurements(m);
            setShowPhysicalModal(false);
          }}
        />
      )}
    </div>
  );
};
