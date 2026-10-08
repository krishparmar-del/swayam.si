import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';

interface SwayamRevealProps {
  onComplete: () => void;
  triggerRecheck?: () => void;
  isCompleted?: boolean;
}

export const SwayamReveal: React.FC<SwayamRevealProps> = ({ 
  onComplete, 
  triggerRecheck, 
  isCompleted = false 
}) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(isCompleted ? 4 : 0);
  const [isRevealed, setIsRevealed] = useState(isCompleted);

  const steps = [
    t('revealStep1'),
    t('revealStep2'),
    t('revealStep3'),
    t('revealStep4'),
  ];

  useEffect(() => {
    if (isCompleted) {
      setCurrentStep(4);
      setIsRevealed(true);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsRevealed(true);
          onComplete();
          return steps.length;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isCompleted]);

  return (
    <div className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E2EFE7] text-[#174B32] flex items-center justify-center shrink-0">
            {isRevealed ? (
              <CheckCircle2 className="w-5 h-5 text-[#277448]" />
            ) : (
              <Loader2 className="w-5 h-5 text-[#174B32] animate-spin" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider flex items-center gap-1.5">
              <span>Swayam Match Engine</span>
              <span className="text-[#C5B898]">·</span>
              <span className="text-[11px] font-normal text-[#5E6E64]">
                {isRevealed ? 'Profile Matched' : `Step ${Math.min(currentStep + 1, steps.length)} of ${steps.length}`}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#174B32] mt-0.5">
              {isRevealed ? t('revealDone') : steps[currentStep] || steps[0]}
            </p>
          </div>
        </div>

        {isRevealed && triggerRecheck && (
          <button
            onClick={() => {
              setIsRevealed(false);
              setCurrentStep(0);
              triggerRecheck();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#174B32] hover:text-[#123724] bg-white px-3 py-1.5 rounded-lg border border-[#E0D8C5] shadow-2xs hover:bg-[#FAF7EE] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#277448]" />
            <span>{t('recheckMatches')}</span>
          </button>
        )}
      </div>

      {/* Subtle Progress Bar */}
      {!isRevealed && (
        <div className="w-full bg-[#E8DFCC] h-1 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-[#174B32] h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
