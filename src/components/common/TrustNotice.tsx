import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';

export const TrustNotice: React.FC<{ variant?: 'banner' | 'card' | 'inline' }> = ({ variant = 'banner' }) => {
  const { t } = useI18n();

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2 text-xs text-[#5E6E64] bg-[#FAF7EE] border border-[#EBE4D5] rounded-lg p-3">
        <Info className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#202A24] font-semibold">Informational Assessment:</strong> Final eligibility is determined exclusively by the official commission upon document verification.
        </p>
      </div>
    );
  }

  return (
    <aside
      aria-label="Informational Assessment Notice"
      className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-lg bg-[#F0E6D2] text-[#7A5B18] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#202A24] tracking-tight">
            {t('trustBannerTitle')}
          </h4>
          <p className="text-xs text-[#5E6E64] mt-0.5 leading-relaxed max-w-3xl">
            {t('trustBannerBody')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#7A5B18] font-medium bg-[#F5ECE0] px-3 py-1.5 rounded-md whitespace-nowrap self-end sm:self-center">
        <span>Civic Integrity Guarantee</span>
      </div>
    </aside>
  );
};
