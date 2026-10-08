import { EducationLevel, IndianState, PhysicalMeasurements, SocialCategory } from './profile';

export type OpportunityType = 'exam' | 'scheme';
export type AuthorityLevel = 'central' | 'state';
export type ApplicationStatus = 'upcoming' | 'open' | 'closing_soon' | 'closed';

export type DocumentReadinessStatus = 'ready' | 'action_needed' | 'missing' | 'unknown' | 'not_required';

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  group?: 'IDENTITY' | 'EDUCATION' | 'CATEGORY_RESERVATION' | 'RESIDENCE_INCOME' | 'OTHER';
  howToObtain?: string;
  officialIssuingAuthority?: string;
}

export interface PhysicalRequirement {
  applicableGender?: 'Male' | 'Female' | 'All';
  minHeightCm?: number;
  minChestCm?: number;
  minChestExpansionCm?: number;
  requiredVision?: string;
  allowsColorBlindness?: boolean;
  relaxationNotes?: string;
}

export interface EligibilityRequirement {
  minAge?: number;
  maxAge?: number;
  ageRelaxation?: Partial<Record<SocialCategory, number>>; // e.g. OBC: +3, SC: +5
  educationLevels: EducationLevel[];
  allowedStreams?: string[];
  minimumPercentage?: number;
  allowedCategories?: SocialCategory[];
  allowedStates?: IndianState[]; // if specific to state, else 'All India'
  pwdEligible: boolean;
  maxFamilyIncome?: number; // In INR, for welfare schemes
  genderRestriction?: 'Male' | 'Female';
  requiresPhysical?: boolean;
  customRequirements?: string[];
}

export type MatchStatus = 'ELIGIBLE' | 'POSSIBLY_ELIGIBLE' | 'MORE_INFORMATION_REQUIRED' | 'NOT_ELIGIBLE';

export interface CriterionCheck {
  criterion: string;
  userValue: string;
  requiredValue: string;
  status: 'pass' | 'fail' | 'missing' | 'warning';
  message: string;
  detail?: string;
}

export interface EligibilityResult {
  status: MatchStatus;
  matchScore: number; // 0 to 100 informational heuristic
  scoreExplanation: string;
  summary: string;
  checks: CriterionCheck[];
  missingFields: string[];
  disclaimer: string;
}

export interface TutorialResource {
  tutorialTitle: string;
  youtubeUrl: string;
  source: string;
  language: string;
  duration?: string;
}

export interface OpportunitySourceItem {
  title: string;
  url: string;
  domain: string;
  isOfficial: boolean;
  dateChecked: string;
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  titleHindi?: string;
  shortDescription: string;
  shortDescriptionHindi?: string;
  fullDescription: string;
  fullDescriptionHindi?: string;
  
  // Organization / Authority
  authority: string;
  authorityHindi?: string;
  level: AuthorityLevel;
  state?: IndianState;
  
  // Tagging & Taxonomy
  tags: string[];
  beneficiaryType?: 'student' | 'youth' | 'women' | 'farmer' | 'general';
  
  // Key Dates & Application
  deadline?: string;
  notificationDate?: string;
  examDate?: string;
  status: ApplicationStatus;
  
  // Benefits
  keyBenefit: string;
  keyBenefitHindi?: string;
  detailedBenefits?: string[];
  
  // Official Links (STRICT: only verified or explicit seed placeholder)
  officialUrl: string;
  notificationUrl?: string;
  applicationUrl?: string;
  isOfficialSourceVerified: boolean;
  
  // Eligibility & Physical requirements
  eligibilityRequirements: EligibilityRequirement;
  physicalRequirements?: PhysicalRequirement;
  
  // Documents
  requiredDocuments: DocumentItem[];
  
  // Tutorial
  tutorial?: TutorialResource;
  
  // Official wording vs simple explanation
  officialExcerpt?: string;
  
  // Frequently Asked Questions
  faqs?: Array<{ question: string; questionHindi?: string; answer: string; answerHindi?: string }>;
  
  // Popularity & metadata
  popularityScore: number;
  lastVerifiedDate: string;

  // Live Web Grounding & Source Verification (Product Mode B)
  sources?: OpportunitySourceItem[];
  sourceType?: 'OFFICIAL' | 'SECONDARY' | 'HYBRID';
  lastChecked?: string;
  explanation?: string;
  conflictingInfoNotes?: string;
  isLiveDiscovered?: boolean;
}
