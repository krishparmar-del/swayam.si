import { UserProfile, INITIAL_USER_PROFILE, IndianState, SocialCategory, EducationLevel } from '../types/profile';
import { DocumentReadinessStatus } from '../types/opportunity';

const PROFILE_STORAGE_KEY = 'swayam_user_profile';
const DOC_WALLET_STORAGE_KEY = 'swayam_document_wallet';

export const ProfileService = {
  getProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        return { ...INITIAL_USER_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse user profile from localStorage', e);
    }
    return INITIAL_USER_PROFILE;
  },

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    try {
      const current = this.getProfile();
      const updated: UserProfile = {
        ...current,
        ...profile,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save user profile', e);
      return { ...INITIAL_USER_PROFILE, ...profile };
    }
  },

  resetProfile(): void {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(DOC_WALLET_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to reset profile data', e);
    }
  },

  toggleSavedOpportunity(id: string): string[] {
    const profile = this.getProfile();
    const isSaved = profile.savedOpportunityIds.includes(id);
    const updatedIds = isSaved
      ? profile.savedOpportunityIds.filter(item => item !== id)
      : [...profile.savedOpportunityIds, id];
    
    this.saveProfile({ savedOpportunityIds: updatedIds });
    return updatedIds;
  },

  isOpportunitySaved(id: string): boolean {
    const profile = this.getProfile();
    return profile.savedOpportunityIds.includes(id);
  },

  // Document Wallet readiness mapping: documentId -> DocumentReadinessStatus
  getDocumentWallet(): Record<string, DocumentReadinessStatus> {
    try {
      const stored = localStorage.getItem(DOC_WALLET_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse document wallet', e);
    }
    // Default initial mock statuses
    return {
      aadhaar_card: 'ready',
      '10th_marksheet': 'ready',
      '12th_marksheet': 'ready',
      graduation_degree: 'action_needed',
      caste_certificate: 'ready',
      income_certificate: 'missing',
      domicile_certificate: 'ready',
      passport_photo: 'ready',
      signature_specimen: 'ready'
    };
  },

  setDocumentStatus(docId: string, status: DocumentReadinessStatus): Record<string, DocumentReadinessStatus> {
    try {
      const current = this.getDocumentWallet();
      const updated = { ...current, [docId]: status };
      localStorage.setItem(DOC_WALLET_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save document status', e);
      return {};
    }
  },

  calculateCompleteness(profile: UserProfile): number {
    let score = 0;
    if (profile.name?.trim()) score += 20;
    if (profile.age > 0) score += 15;
    if (profile.state) score += 15;
    if (profile.category) score += 15;
    if (profile.educationLevel) score += 15;
    if (profile.degreeName) score += 10;
    if (profile.annualFamilyIncome !== undefined) score += 10;
    return Math.min(100, score);
  }
};
