import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Loader2, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Opportunity, MatchStatus } from '../../types/opportunity';
import { UserProfile } from '../../types/profile';
import { OpportunityService } from '../../services/opportunityService';
import { EligibilityEngine } from '../../services/eligibilityEngine';
import { OpportunityCard } from './OpportunityCard';
import { useI18n } from '../../i18n/LanguageContext';

interface DynamicSearchIntelligenceProps {
  user: UserProfile;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (id: string) => void;
}

export const DynamicSearchIntelligence: React.FC<DynamicSearchIntelligenceProps> = ({
  user,
  onSelectOpportunity,
  onToggleSave
}) => {
  const { t } = useI18n();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultOpportunity, setResultOpportunity] = useState<Opportunity | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleQueries = [
    'PM Vishwakarma Scheme',
    'UPSC CDS Exam',
    'Scholarships for B.Tech students in MP',
    'Post-Matric Scholarship for OBC',
    'Any government schemes for PWD students'
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    if (targetQuery) setQuery(targetQuery);

    setIsSearching(true);
    setErrorMsg(null);
    setSearchFeedback(null);
    setResultOpportunity(null);

    try {
      const res = await OpportunityService.searchWithLiveGrounding(q, user);

      if (res.liveOpportunity) {
        setResultOpportunity(res.liveOpportunity);
        setSearchFeedback(
          `Live web verification complete. Grounded with official sources for "${res.liveOpportunity.title}".`
        );
      } else if (res.localMatches.length > 0) {
        setResultOpportunity(res.localMatches[0]);
        setSearchFeedback(
          `Found verified match in SWAYAM.SI registry for "${res.localMatches[0].title}".`
        );
      } else {
        setErrorMsg(`We couldn't verify "${q}" from official government portals right now. Please check official portals like india.gov.in or ssc.gov.in.`);
      }
    } catch (_err) {
      // Graceful fallback to offline local verified registry
      try {
        const localMatches = await OpportunityService.search(q);
        if (localMatches.length > 0) {
          setResultOpportunity(localMatches[0]);
          setSearchFeedback(`Found verified match in SWAYAM.SI registry for "${localMatches[0].title}".`);
        } else {
          setErrorMsg(`We couldn't verify "${q}" right now. Please explore popular exams and schemes in the directory.`);
        }
      } catch {
        setErrorMsg('Search request failed. Please check network connectivity.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const evalResult = resultOpportunity 
    ? EligibilityEngine.evaluate(user, resultOpportunity) 
    : null;

  return (
    <div className="bg-white border-2 border-[#174B32]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EFE7] text-[#174B32] text-xs font-bold border border-[#BDDBC8] mb-1.5">
            <Globe className="w-3.5 h-3.5 text-[#277448]" />
            <span>DYNAMIC OPPORTUNITY INTELLIGENCE · LIVE WEB GROUNDING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#174B32] tracking-tight">
            Ask Swayam anything about exams or government schemes
          </h2>
          <p className="text-xs text-[#5E6E64] mt-0.5">
            Searches local verified data and live Google Search (.gov.in / official gazettes) for any scheme or competitive exam.
          </p>
        </div>
      </div>

      {/* Prominent Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any exam or scheme (e.g. 'PM Vishwakarma', 'UPSC CDS', 'MP scholarship for B.Tech')..."
            className="w-full bg-[#FAF7EE] border-2 border-[#E0D8C5] focus:border-[#174B32] focus:bg-white rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#202A24] focus:outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="w-full sm:w-auto px-6 py-3 bg-[#174B32] hover:bg-[#123724] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#F2A93B]" />
              <span>Searching Web...</span>
            </>
          ) : (
            <>
              <span>Research Live</span>
              <ArrowRight className="w-4 h-4 text-[#F2A93B]" />
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-semibold text-[#6E7E73] text-[11px]">Popular searches:</span>
        {sampleQueries.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => handleSearch(sample)}
            className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#EBF5EE] text-[#174B32] border border-[#E0D8C5] rounded-lg transition-colors text-[11px] font-medium"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Live Feedback Banner */}
      {searchFeedback && (
        <div className="p-3 bg-[#E2EFE7] border border-[#BDDBC8] rounded-xl text-xs text-[#174B32] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#277448] shrink-0" />
          <p className="font-medium">{searchFeedback}</p>
        </div>
      )}

      {/* Helpful Guidance or Discovery Notice */}
      {errorMsg && (
        <div className="p-3.5 bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl text-xs text-[#4E5D53] space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-[#174B32]">
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
            <span>Search Guidance</span>
          </div>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Discovered Result Card */}
      {resultOpportunity && evalResult && (
        <div className="pt-2 border-t border-[#F0EBE1] space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#174B32] flex items-center gap-2">
              <span>Verified Discovered Opportunity</span>
              {resultOpportunity.isLiveDiscovered && (
                <span className="text-[10px] bg-[#FEF3D6] text-[#8C6D23] font-bold px-2 py-0.5 rounded border border-[#F2DFB3]">
                  Live Grounded
                </span>
              )}
            </h3>
            <span className="text-xs text-[#5E6E64]">
              Last Checked: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          <OpportunityCard
            opportunity={resultOpportunity}
            matchScore={evalResult.matchScore}
            matchStatus={evalResult.status}
            isSaved={user.savedOpportunityIds.includes(resultOpportunity.id)}
            onToggleSave={onToggleSave}
            onSelect={onSelectOpportunity}
          />
        </div>
      )}
    </div>
  );
};
