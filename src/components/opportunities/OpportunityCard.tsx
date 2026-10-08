import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Bookmark, 
  BookmarkCheck,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Opportunity, MatchStatus } from '../../types/opportunity';
import { useI18n } from '../../i18n/LanguageContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchStatus?: MatchStatus;
  matchScore?: number;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  matchStatus = 'POSSIBLY_ELIGIBLE',
  matchScore = 75,
  isSaved = false,
  onToggleSave,
  onSelect
}) => {
  const { language, t } = useI18n();

  const title = language === 'hi' && opportunity.titleHindi ? opportunity.titleHindi : opportunity.title;
  const description = language === 'hi' && opportunity.shortDescriptionHindi ? opportunity.shortDescriptionHindi : opportunity.shortDescription;
  const authority = language === 'hi' && opportunity.authorityHindi ? opportunity.authorityHindi : opportunity.authority;

  // Status visual mapping (paired text + icon, not color alone)
  const statusConfig = {
    ELIGIBLE: {
      label: t('strongMatch'),
      icon: CheckCircle2,
      textColor: 'text-[#174B32]',
      bgColor: 'bg-[#E2EFE7]',
      borderColor: 'border-[#BDDBC8]'
    },
    POSSIBLY_ELIGIBLE: {
      label: t('possibleMatch'),
      icon: CheckCircle2,
      textColor: 'text-[#1F5A38]',
      bgColor: 'bg-[#EBF5EE]',
      borderColor: 'border-[#C8E4D3]'
    },
    MORE_INFORMATION_REQUIRED: {
      label: t('moreInfoNeeded'),
      icon: HelpCircle,
      textColor: 'text-[#8C6D23]',
      bgColor: 'bg-[#FEF6E4]',
      borderColor: 'border-[#F2DFB3]'
    },
    NOT_ELIGIBLE: {
      label: t('notMatch'),
      icon: AlertCircle,
      textColor: 'text-[#8A3B3B]',
      bgColor: 'bg-[#FBEAE9]',
      borderColor: 'border-[#EFC2BE]'
    }
  }[matchStatus] || {
    label: t('possibleMatch'),
    icon: CheckCircle2,
    textColor: 'text-[#1F5A38]',
    bgColor: 'bg-[#EBF5EE]',
    borderColor: 'border-[#C8E4D3]'
  };

  const StatusIcon = statusConfig.icon;

  return (
    <article
      onClick={() => onSelect(opportunity)}
      className="group bg-[#FFFFFF] hover:bg-[#FFFDF7] border border-[#E8DFCC] hover:border-[#174B32]/40 rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3.5">
        {/* Card Kicker & Authority (Zero-Pill: Clean unboxed text with separators) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#5E6E64] font-medium flex-wrap">
            <span className="font-semibold text-[#174B32]">{authority}</span>
            <span aria-hidden="true" className="text-[#C5B898]">·</span>
            <span className="capitalize">{opportunity.level} {opportunity.state ? `(${opportunity.state})` : 'Govt'}</span>
            <span aria-hidden="true" className="text-[#C5B898]">·</span>
            <span className="capitalize">{opportunity.type === 'exam' ? 'Recruitment' : 'Welfare'}</span>
          </div>

          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(opportunity.id);
              }}
              className="p-1.5 text-[#7A8C80] hover:text-[#174B32] hover:bg-[#FAF7EE] rounded-lg transition-colors"
              title={isSaved ? "Remove from saved" : "Save for later"}
              aria-label={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-[#174B32] fill-[#174B32]/20" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#174B32] group-hover:text-[#123724] tracking-tight leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#4E5D53] line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Key Benefit Highlights Box */}
        <div className="bg-[#FAF7EE] border border-[#EDE6D6] rounded-xl p-3 text-xs text-[#202A24]">
          <span className="font-bold text-[#8C6D23] block text-[11px] uppercase tracking-wider mb-0.5">
            Key Benefit
          </span>
          <p className="font-medium text-[#202A24] leading-snug">
            {opportunity.keyBenefit}
          </p>
        </div>
      </div>

      {/* Footer Area: Metadata + Status + CTA */}
      <div className="mt-5 pt-4 border-t border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Clean unboxed deadline and physical tag */}
        <div className="flex items-center gap-2 text-xs text-[#5E6E64]">
          {opportunity.deadline && (
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Apply by {new Date(opportunity.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          )}

          {opportunity.eligibilityRequirements.requiresPhysical && (
            <>
              <span aria-hidden="true" className="text-[#C5B898]">·</span>
              <span className="text-[#8C6D23] font-medium flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>Physical Test</span>
              </span>
            </>
          )}
        </div>

        {/* Match status badge + View link */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          <span className="text-xs font-bold text-[#174B32] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
