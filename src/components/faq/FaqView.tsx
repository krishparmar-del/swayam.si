import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, CircleHelp } from 'lucide-react';
import { SEED_FAQS } from '../../data/seedFaqs';
import { useI18n } from '../../i18n/LanguageContext';

export const FaqView: React.FC = () => {
  const { language, t } = useI18n();

  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(SEED_FAQS[0]?.id || null);

  const filteredFaqs = useMemo(() => {
    if (!search.trim()) return SEED_FAQS;
    const q = search.toLowerCase();
    return SEED_FAQS.filter((f) =>
      f.questionEn.toLowerCase().includes(q) ||
      f.questionHi.toLowerCase().includes(q) ||
      f.answerEn.toLowerCase().includes(q) ||
      f.answerHi.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#174B32] tracking-tight">
          {t('faqTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6E64] mt-1 max-w-2xl">
          {t('faqSubtitle')}
        </p>
      </div>

      {/* Search Bar inside FAQ */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchFaqPlaceholder')}
          className="w-full bg-white border border-[#E0D8C5] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#202A24] focus:outline-none focus:border-[#1F5A38]"
        />
      </div>

      {/* Accordion FAQ Items */}
      <div className="bg-white border border-[#E8DFCC] rounded-2xl divide-y divide-[#F0EBE1] shadow-xs overflow-hidden">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const question = language === 'hi' ? faq.questionHi : faq.questionEn;
            const answer = language === 'hi' ? faq.answerHi : faq.answerEn;

            return (
              <div key={faq.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7EE] focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-[#174B32] leading-snug">
                    {question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C6D23] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4E5D53] leading-relaxed border-t border-[#F5EFE3] bg-[#FAF7EE]/50 animate-in fade-in duration-100">
                    {answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-[#7A8C80]">
            No FAQ entries matched your search.
          </div>
        )}
      </div>
    </div>
  );
};
