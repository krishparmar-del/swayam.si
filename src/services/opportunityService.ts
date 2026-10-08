import { Opportunity, OpportunityType } from '../types/opportunity';
import { UserProfile } from '../types/profile';
import { SEED_OPPORTUNITIES } from '../data/seedOpportunities';
import { EligibilityEngine } from './eligibilityEngine';

/**
 * OpportunityService
 * Clean data-access abstraction. Later, the seed array implementation will be swapped
 * with direct Supabase client queries without needing any modifications to the React UI components.
 * 
 * Supports two complementary data modes:
 * MODE A: Verified local data for frequently accessed and high-priority opportunities.
 * MODE B: Live web discovery for opportunities not present in the local database,
 *         grounded using Gemini with Google Search tool.
 */
export const OpportunityService = {
  async getAll(): Promise<Opportunity[]> {
    return [...SEED_OPPORTUNITIES];
  },

  async getById(id: string): Promise<Opportunity | null> {
    const item = SEED_OPPORTUNITIES.find(o => o.id === id);
    if (item) return { ...item };

    // Check local session storage for dynamically discovered items
    try {
      const stored = sessionStorage.getItem(`swayam_dyn_${id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    return null;
  },

  async getExams(filters?: {
    level?: 'central' | 'state';
    status?: 'upcoming' | 'open' | 'closing_soon' | 'closed';
    requiresPhysical?: boolean;
    searchQuery?: string;
  }): Promise<Opportunity[]> {
    let list = SEED_OPPORTUNITIES.filter(o => o.type === 'exam');

    if (filters?.level) {
      list = list.filter(o => o.level === filters.level);
    }
    if (filters?.status) {
      list = list.filter(o => o.status === filters.status);
    }
    if (filters?.requiresPhysical !== undefined) {
      list = list.filter(o => !!o.eligibilityRequirements.requiresPhysical === filters.requiresPhysical);
    }
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(o => 
        o.title.toLowerCase().includes(q) ||
        (o.titleHindi && o.titleHindi.toLowerCase().includes(q)) ||
        o.authority.toLowerCase().includes(q) ||
        o.shortDescription.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async getSchemes(filters?: {
    level?: 'central' | 'state';
    beneficiaryType?: 'student' | 'youth' | 'women' | 'farmer' | 'general';
    searchQuery?: string;
    requiredDocId?: string;
  }): Promise<Opportunity[]> {
    let list = SEED_OPPORTUNITIES.filter(o => o.type === 'scheme');

    if (filters?.level) {
      list = list.filter(o => o.level === filters.level);
    }
    if (filters?.beneficiaryType) {
      list = list.filter(o => o.beneficiaryType === filters.beneficiaryType);
    }
    if (filters?.requiredDocId) {
      list = list.filter(o => o.requiredDocuments.some(d => d.id === filters.requiredDocId));
    }
    if (filters?.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(o => 
        o.title.toLowerCase().includes(q) ||
        (o.titleHindi && o.titleHindi.toLowerCase().includes(q)) ||
        o.authority.toLowerCase().includes(q) ||
        o.shortDescription.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  },

  async search(query: string): Promise<Opportunity[]> {
    if (!query?.trim()) return [];
    const q = query.toLowerCase().trim();

    return SEED_OPPORTUNITIES.filter(o =>
      o.title.toLowerCase().includes(q) ||
      (o.titleHindi && o.titleHindi.toLowerCase().includes(q)) ||
      o.authority.toLowerCase().includes(q) ||
      o.shortDescription.toLowerCase().includes(q) ||
      (o.shortDescriptionHindi && o.shortDescriptionHindi.toLowerCase().includes(q)) ||
      (o.state && o.state.toLowerCase().includes(q)) ||
      o.tags.some(t => t.toLowerCase().includes(q))
    );
  },

  /**
   * Dynamic Opportunity Intelligence:
   * Mode A: Checks local database first.
   * Mode B: If no exact match, calls live server-side search grounding endpoint.
   */
  async searchWithLiveGrounding(
    query: string,
    userProfile?: UserProfile
  ): Promise<{
    localMatches: Opportunity[];
    liveOpportunity: Opportunity | null;
    isLiveSearch: boolean;
    error?: string;
  }> {
    const q = query.trim();
    if (!q) {
      return { localMatches: [], liveOpportunity: null, isLiveSearch: false };
    }

    // 1. Search Mode A: Local database
    const localMatches = await this.search(q);
    const hasStrongLocalMatch = localMatches.some(m => 
      m.title.toLowerCase().includes(q.toLowerCase()) || 
      q.toLowerCase().includes(m.title.toLowerCase())
    );

    // If strong local match exists and query isn't explicitly requesting a fresh web verification
    if (hasStrongLocalMatch && !q.toLowerCase().includes('current') && !q.toLowerCase().includes('live')) {
      return {
        localMatches,
        liveOpportunity: null,
        isLiveSearch: false,
      };
    }

    // 2. Search Mode B: Live Web Grounding via Server API
    try {
      const res = await fetch('/api/opportunity/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, userProfile })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const liveData = await res.json();
      if (liveData && liveData.title) {
        const liveOpportunity: Opportunity = {
          ...liveData,
          id: liveData.id || `live-${Date.now()}`,
          isLiveDiscovered: true,
          sourceType: liveData.sources?.some((s: any) => s.isOfficial) ? 'OFFICIAL' : 'SECONDARY',
        };

        // Cache in session
        try {
          sessionStorage.setItem(`swayam_dyn_${liveOpportunity.id}`, JSON.stringify(liveOpportunity));
        } catch {
          // ignore
        }

        return {
          localMatches,
          liveOpportunity,
          isLiveSearch: true,
        };
      }
    } catch (_err) {
      return {
        localMatches,
        liveOpportunity: null,
        isLiveSearch: true,
      };
    }

    return { localMatches, liveOpportunity: null, isLiveSearch: false };
  },

  async getRecommended(user: UserProfile, limit = 6): Promise<Array<{ opportunity: Opportunity; matchScore: number; status: string }>> {
    const list = SEED_OPPORTUNITIES.map(op => {
      const evalResult = EligibilityEngine.evaluate(user, op);
      return {
        opportunity: op,
        matchScore: evalResult.matchScore,
        status: evalResult.status
      };
    });

    return list
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  },

  async getRecommendedExams(user: UserProfile, limit = 4): Promise<Array<{ opportunity: Opportunity; matchScore: number; status: string }>> {
    const list = SEED_OPPORTUNITIES
      .filter(o => o.type === 'exam')
      .map(op => {
        const evalResult = EligibilityEngine.evaluate(user, op);
        return {
          opportunity: op,
          matchScore: evalResult.matchScore,
          status: evalResult.status
        };
      });

    return list
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  },

  async getRecommendedSchemes(user: UserProfile, limit = 4): Promise<Array<{ opportunity: Opportunity; matchScore: number; status: string }>> {
    const list = SEED_OPPORTUNITIES
      .filter(o => o.type === 'scheme')
      .map(op => {
        const evalResult = EligibilityEngine.evaluate(user, op);
        return {
          opportunity: op,
          matchScore: evalResult.matchScore,
          status: evalResult.status
        };
      });

    return list
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  },

  async getUpcomingDeadlines(limit = 4): Promise<Opportunity[]> {
    const today = new Date().toISOString().split('T')[0];
    return SEED_OPPORTUNITIES
      .filter(o => o.deadline && o.deadline >= today)
      .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
      .slice(0, limit);
  }
};
