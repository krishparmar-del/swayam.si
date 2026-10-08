import React from 'react';
import { GraduationCap, Landmark, ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';

interface IntentModalProps {
  isOpen: boolean;
  onSelectIntent: (intent: 'exams' | 'schemes' | 'both') => void;
}

export const IntentModal: React.FC<IntentModalProps> = ({ isOpen, onSelectIntent }) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#E8DFCC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7EE] text-[#8C6D23] text-xs font-bold border border-[#E8DFCC] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            <span>Profile Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
            {t('intentModalTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6E64] max-w-md mx-auto leading-relaxed">
            {t('intentModalSubtitle')}
          </p>
        </div>

        {/* Two Large Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Competitive Exams */}
          <button
            onClick={() => onSelectIntent('exams')}
            className="group text-left p-5 rounded-2xl bg-[#FFFDF7] hover:bg-[#FAF7EE] border-2 border-[#E8DFCC] hover:border-[#174B32] transition-all transform hover:-translate-y-0.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1F5A38]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E2EFE7] text-[#174B32] group-hover:bg-[#174B32] group-hover:text-white transition-colors flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174B32] tracking-tight flex items-center justify-between">
              <span>{t('intentExamsTitle')}</span>
              <ArrowRight className="w-4 h-4 text-[#F2A93B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#5E6E64] mt-1.5 leading-relaxed">
              {t('intentExamsDesc')}
            </p>
          </button>

          {/* Card 2: Government Schemes */}
          <button
            onClick={() => onSelectIntent('schemes')}
            className="group text-left p-5 rounded-2xl bg-[#FFFDF7] hover:bg-[#FAF7EE] border-2 border-[#E8DFCC] hover:border-[#174B32] transition-all transform hover:-translate-y-0.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1F5A38]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FEF3D6] text-[#8C6D23] group-hover:bg-[#8C6D23] group-hover:text-white transition-colors flex items-center justify-center mb-4">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#174B32] tracking-tight flex items-center justify-between">
              <span>{t('intentSchemesTitle')}</span>
              <ArrowRight className="w-4 h-4 text-[#F2A93B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-[#5E6E64] mt-1.5 leading-relaxed">
              {t('intentSchemesDesc')}
            </p>
          </button>
        </div>

        {/* Explore Everything Option */}
        <div className="text-center pt-2">
          <button
            onClick={() => onSelectIntent('both')}
            className="text-xs font-semibold text-[#5E6E64] hover:text-[#174B32] underline underline-offset-4 transition-colors"
          >
            {t('intentBoth')}
          </button>
        </div>
      </div>
    </div>
  );
};
