import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  Landmark, 
  Globe, 
  Lock,
  FolderCheck,
  Check,
  Clock,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';
import { Logo } from '../brand/Logo';
import { 
  UserProfile, 
  SocialCategory, 
  EducationLevel, 
  IndianState 
} from '../../types/profile';
import { DocumentReadinessStatus, DocumentItem } from '../../types/opportunity';
import { MASTER_DOCUMENTS } from '../../data/masterDocuments';
import { ProfileService } from '../../services/profileService';

interface OnboardingFlowProps {
  onComplete: (profile: Partial<UserProfile>, docWallet?: Record<string, DocumentReadinessStatus>) => void;
}

const INDIAN_STATES: IndianState[] = [
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Bihar',
  'Rajasthan',
  'Maharashtra',
  'Delhi (NCT)',
  'Haryana',
  'Punjab',
  'Chhattisgarh',
  'Jharkhand',
  'Gujarat',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'All India'
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { t, language, toggleLanguage } = useI18n();

  // Steps: 1 = Profile, 2 = Education, 3 = Document Wallet, 4 = Matching Progress State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Profile State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(21);
  const [state, setState] = useState<IndianState>('Madhya Pradesh');
  const [category, setCategory] = useState<SocialCategory>('General');
  const [isPwd, setIsPwd] = useState<boolean>(false);
  const [pwdPercentage, setPwdPercentage] = useState<number>(40);

  // Step 2: Education State
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate');
  const [degreeName, setDegreeName] = useState('B.Tech / Bachelor of Technology');
  const [passingYear, setPassingYear] = useState<number>(2026);
  const [annualIncome, setAnnualIncome] = useState<string>('300000'); // Optional income

  // Step 3: Document Wallet State (Loaded from and saved directly to localStorage)
  const [docWallet, setDocWallet] = useState<Record<string, DocumentReadinessStatus>>(() => {
    return ProfileService.getDocumentWallet();
  });

  // Step 4: Matching Progress State
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [matchingStepText, setMatchingStepText] = useState('Analyzing educational qualifications...');

  // Grouped documents for Step 3 baseline onboarding
  // Broadly relevant baseline documents
  const baselineDocGroups = [
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
      docs: MASTER_DOCUMENTS.filter(d => {
        if (d.group !== 'CATEGORY_RESERVATION') return false;
        if (d.id === 'pwd_certificate' && !isPwd) return false;
        if (d.id === 'caste_certificate' && category === 'General') return false;
        if (d.id === 'ews_certificate' && category !== 'EWS') return false;
        return true;
      })
    },
    {
      groupKey: 'RESIDENCE_INCOME',
      title: 'Residence & Income',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'RESIDENCE_INCOME')
    },
    {
      groupKey: 'OTHER',
      title: 'Application Essentials',
      docs: MASTER_DOCUMENTS.filter(d => d.group === 'OTHER')
    }
  ].filter(g => g.docs.length > 0);

  // Handle immediate document status update with persistent local storage
  const handleDocStatusChange = (docId: string, status: DocumentReadinessStatus) => {
    const updated = ProfileService.setDocumentStatus(docId, status);
    setDocWallet(updated);
  };

  // Step 4: Animated Matching Progress Engine
  useEffect(() => {
    if (step !== 4) return;

    const milestones = [
      { progress: 25, text: 'Verifying education level & graduation status...' },
      { progress: 55, text: 'Applying state domicile & category relaxations...' },
      { progress: 85, text: 'Correlating verified document readiness with official exam criteria...' },
      { progress: 100, text: 'Matches compiled! Opening personalized results...' }
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < milestones.length) {
        setMatchingProgress(milestones[currentIdx].progress);
        setMatchingStepText(milestones[currentIdx].text);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Finalize onboarding and redirect to results
          onComplete({
            name: name.trim() || 'Fellow Citizen',
            age: Number(age) || 21,
            state,
            category,
            isPwd,
            pwdPercentage: isPwd ? pwdPercentage : undefined,
            educationLevel,
            degreeName,
            passingYear: Number(passingYear) || 2026,
            annualFamilyIncome: annualIncome ? Number(annualIncome) : undefined,
            isOnboarded: true,
          }, docWallet);
        }, 350);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [step]);

  const handleStartMatching = () => {
    setStep(4);
  };

  const categories: SocialCategory[] = ['General', 'OBC', 'SC', 'ST', 'EWS'];
  const eduLevels: EducationLevel[] = ['10th', '12th', 'Diploma', 'Undergraduate', 'Postgraduate'];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#202A24] flex flex-col justify-between selection:bg-[#E2F0E7]">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Logo variant="full" size="md" />
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#174B32] bg-[#FAF7EE] hover:bg-[#EBF5EE] border border-[#E0D8C5] rounded-lg transition-colors"
          aria-label="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#277448]" />
          <span>{language === 'en' ? 'हिंदी में बदलें' : 'English'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Welcome Banner */}
          {step < 4 && (
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight text-balance">
                {step === 3 ? 'Your Document Wallet' : t('heroTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-[#5E6E64] max-w-lg mx-auto leading-relaxed">
                {step === 3 
                  ? 'Tell us which documents you already have. This helps us find opportunities you can actually prepare for.' 
                  : t('heroSubtitle')}
              </p>
            </div>
          )}

          {/* Stepper Card */}
          <div className="bg-[#FFFFFF] border border-[#E8DFCC] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Simple Progress Indicator */}
            {step < 4 && (
              <div className="flex items-center justify-between pb-5 border-b border-[#F0EBE1] mb-6">
                <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
                  <div className={`flex items-center gap-1 ${step >= 1 ? 'text-[#174B32]' : 'text-[#7A8C80]'}`}>
                    <span>Profile</span>
                    {step > 1 && <span className="text-[#277448]">✓</span>}
                  </div>
                  <span className="text-[#DDD5C3]">→</span>
                  <div className={`flex items-center gap-1 ${step >= 2 ? 'text-[#174B32]' : 'text-[#7A8C80]'}`}>
                    <span>Education</span>
                    {step > 2 && <span className="text-[#277448]">✓</span>}
                  </div>
                  <span className="text-[#DDD5C3]">→</span>
                  <div className={`flex items-center gap-1 ${step === 3 ? 'text-[#174B32]' : 'text-[#7A8C80]'}`}>
                    <span>Documents</span>
                    {step === 3 && <span className="text-[#DDA032]">→</span>}
                  </div>
                  <span className="text-[#DDD5C3]">→</span>
                  <div className="text-[#7A8C80]">
                    <span>Find Opportunities</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
                  Step {step} of 3
                </span>
              </div>
            )}

            {/* STEP 1: Basic Profile */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="user-name" className="text-xs font-bold text-[#202A24] block">
                    {t('fullName')}
                  </label>
                  <input
                    id="user-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="user-age" className="text-xs font-bold text-[#202A24] block">
                      {t('age')}
                    </label>
                    <input
                      id="user-age"
                      type="number"
                      required
                      min={14}
                      max={65}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="user-state" className="text-xs font-bold text-[#202A24] block">
                      {t('state')}
                    </label>
                    <select
                      id="user-state"
                      value={state}
                      onChange={(e) => setState(e.target.value as IndianState)}
                      className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#202A24] block">
                    {t('socialCategory')}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                          category === c
                            ? 'bg-[#174B32] text-white border-[#174B32] shadow-2xs'
                            : 'bg-[#FAF7EE] text-[#5E6E64] border-[#E0D8C5] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="user-pwd" className="text-xs font-bold text-[#202A24]">
                      {t('pwdStatus')}
                    </label>
                    <input
                      id="user-pwd"
                      type="checkbox"
                      checked={isPwd}
                      onChange={(e) => setIsPwd(e.target.checked)}
                      className="w-4 h-4 accent-[#1F5A38] rounded cursor-pointer"
                    />
                  </div>
                  {isPwd && (
                    <div className="pt-2 border-t border-[#E0D8C5] flex items-center justify-between">
                      <span className="text-xs text-[#5E6E64]">{t('pwdPercentLabel')}:</span>
                      <input
                        type="number"
                        min={40}
                        max={100}
                        value={pwdPercentage}
                        onChange={(e) => setPwdPercentage(Number(e.target.value))}
                        className="w-20 bg-white border border-[#E0D8C5] rounded-lg px-2.5 py-1 text-xs text-right font-bold text-[#202A24]"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#174B32] hover:bg-[#123724] text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  <span>Continue to Education</span>
                  <ArrowRight className="w-4 h-4 text-[#F2A93B]" />
                </button>
              </form>
            )}

            {/* STEP 2: Education & Household Income */}
            {step === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#202A24] block">
                    {t('highestEducation')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {eduLevels.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEducationLevel(lvl)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                          educationLevel === lvl
                            ? 'bg-[#174B32] text-white border-[#174B32] shadow-2xs'
                            : 'bg-[#FAF7EE] text-[#5E6E64] border-[#E0D8C5] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="degree-name" className="text-xs font-bold text-[#202A24] block">
                    Degree or Stream
                  </label>
                  <input
                    id="degree-name"
                    type="text"
                    required
                    value={degreeName}
                    onChange={(e) => setDegreeName(e.target.value)}
                    placeholder="e.g. B.Tech / B.Sc / BA / B.Com"
                    className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="passing-year" className="text-xs font-bold text-[#202A24] block">
                      Completion Year
                    </label>
                    <input
                      id="passing-year"
                      type="number"
                      required
                      min={2000}
                      max={2032}
                      value={passingYear}
                      onChange={(e) => setPassingYear(Number(e.target.value))}
                      className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="annual-income" className="text-xs font-bold text-[#202A24] block">
                      Annual Family Income (₹)
                    </label>
                    <input
                      id="annual-income"
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      placeholder="e.g. 250000"
                      className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl px-4 py-2.5 text-sm text-[#202A24] focus:bg-white focus:outline-none focus:border-[#1F5A38]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 bg-white border border-[#DDD5C3] hover:bg-[#FAF7EE] text-[#5E6E64] font-semibold rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#174B32] hover:bg-[#123724] text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <span>Open Document Wallet</span>
                    <ArrowRight className="w-4 h-4 text-[#F2A93B]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Document Wallet (The dedicated verification step requested by user) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="p-3 bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl flex items-center justify-between text-xs text-[#5E6E64]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#174B32]" />
                    <span>No files uploaded. SWAYAM tracks readiness locally in your browser only.</span>
                  </div>
                </div>

                {/* Grouped Document List */}
                <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
                  {baselineDocGroups.map((group) => (
                    <div key={group.groupKey} className="space-y-2.5">
                      <h3 className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
                        {group.title}
                      </h3>

                      <div className="divide-y divide-[#F0EBE1] border border-[#E8DFCC] rounded-xl overflow-hidden bg-white">
                        {group.docs.map((doc) => {
                          const currentStatus = docWallet[doc.id] || 'missing';

                          return (
                            <div key={doc.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7EE]/40 transition-colors">
                              <div className="space-y-0.5 max-w-sm">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-[#202A24]">
                                    {doc.name}
                                  </h4>
                                  {doc.isMandatory && (
                                    <span className="text-[10px] font-bold text-[#8A3B3B] bg-[#FBEAE9] px-1.5 py-0.2 rounded">
                                      Essential
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#5E6E64] line-clamp-2">
                                  {doc.description}
                                </p>
                              </div>

                              {/* Obvious 4-state status controls requested by user */}
                              <div className="grid grid-cols-4 gap-1 sm:w-80 shrink-0">
                                {/* 🟢 HAVE */}
                                <button
                                  type="button"
                                  onClick={() => handleDocStatusChange(doc.id, 'ready')}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                                    currentStatus === 'ready'
                                      ? 'bg-[#E2EFE7] text-[#174B32] border-[#277448] shadow-2xs ring-1 ring-[#277448]'
                                      : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#EBF5EE]'
                                  }`}
                                  title="I have this document"
                                >
                                  <span>🟢 Have</span>
                                </button>

                                {/* 🟡 GETTING */}
                                <button
                                  type="button"
                                  onClick={() => handleDocStatusChange(doc.id, 'action_needed')}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                                    currentStatus === 'action_needed'
                                      ? 'bg-[#FEF3D6] text-[#8C6D23] border-[#DDA032] shadow-2xs ring-1 ring-[#DDA032]'
                                      : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FEF6E4]'
                                  }`}
                                  title="I am applying for this"
                                >
                                  <span>🟡 Getting</span>
                                </button>

                                {/* 🔴 MISSING */}
                                <button
                                  type="button"
                                  onClick={() => handleDocStatusChange(doc.id, 'missing')}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                                    currentStatus === 'missing'
                                      ? 'bg-[#FBEAE9] text-[#8A3B3B] border-[#8A3B3B] shadow-2xs ring-1 ring-[#8A3B3B]'
                                      : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-[#FBEAE9]'
                                  }`}
                                  title="I don't have this"
                                >
                                  <span>🔴 Missing</span>
                                </button>

                                {/* ⚪ NOT SURE */}
                                <button
                                  type="button"
                                  onClick={() => handleDocStatusChange(doc.id, 'unknown')}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                                    currentStatus === 'unknown'
                                      ? 'bg-slate-100 text-[#202A24] border-[#7A8C80] shadow-2xs ring-1 ring-[#7A8C80]'
                                      : 'bg-[#FAF7EE] text-[#5E6E64] border-[#DDD5C3] hover:bg-slate-100'
                                  }`}
                                  title="Not sure about this document"
                                >
                                  <span>⚪ Not sure</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary CTA Button: Find my opportunities */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 bg-white border border-[#DDD5C3] hover:bg-[#FAF7EE] text-[#5E6E64] font-semibold rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleStartMatching}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-[#174B32] hover:bg-[#123724] text-white text-sm font-extrabold rounded-xl shadow-md transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#F2A93B]" />
                    <span>Find my opportunities</span>
                    <ArrowRight className="w-4 h-4 text-[#F2A93B]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Matching Progress Engine State (Fast & Polished ~1.5s) */}
            {step === 4 && (
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E2EFE7] text-[#174B32] flex items-center justify-center mx-auto border border-[#BDDBC8]">
                  <Loader2 className="w-8 h-8 text-[#277448] animate-spin" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#174B32]">
                    Matching Your Opportunities
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E6E64] font-medium h-5">
                    {matchingStepText}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto bg-[#E8DFCC] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#174B32] h-full transition-all duration-300 ease-out"
                    style={{ width: `${matchingProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[#7A8C80] pt-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#277448]" />
                    Education match
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#277448]" />
                    State quota
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#277448]" />
                    Document wallet
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Legal Disclosure */}
      <footer className="px-6 py-3 border-t border-[#EDE6D6] text-center text-[11px] text-[#7A8C80]">
        SWAYAM.SI is an independent citizen advisory utility. Always verify terms on official portals.
      </footer>
    </div>
  );
};
