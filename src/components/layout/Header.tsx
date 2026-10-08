import React from 'react';
import { Search, Globe, ShieldCheck, User } from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';
import { Logo } from '../brand/Logo';
import { UserProfile } from '../../types/profile';

interface HeaderProps {
  onSearchClick?: () => void;
  onAuditClick?: () => void;
  onProfileClick?: () => void;
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeNav: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAuditClick,
  onProfileClick,
  user,
  searchQuery,
  onSearchChange,
  activeNav,
  onNavigate
}) => {
  const { language, toggleLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#EDE6D6] px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-left focus-visible:outline-2 focus-visible:outline-[#174B32] rounded-lg"
            aria-label="SWAYAM.SI Home"
          >
            <Logo variant="full" size="md" />
          </button>
        </div>

        {/* Zone 2: Navigation Links & Search (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C80]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#FAF7EE] border border-[#E0D8C5] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#202A24] placeholder:text-[#7A8C80] focus:bg-white focus:outline-none focus:border-[#1F5A38] focus:ring-1 focus:ring-[#1F5A38] transition-all"
            />
          </div>
        </div>

        {/* Zone 3: Actions (Language toggle, System Audit, Profile Avatar) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#174B32] bg-[#FAF7EE] hover:bg-[#EBF5EE] border border-[#E0D8C5] rounded-lg transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1F5A38]"
            title="Switch Language / भाषा बदलें"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            <Globe className="w-3.5 h-3.5 text-[#277448]" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* System Audit Trigger */}
          <button
            onClick={onAuditClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#664E11] bg-[#FFF8E8] hover:bg-[#FCEFD0] border border-[#ECD9A8] rounded-lg transition-colors whitespace-nowrap"
            title="View Engine Audit Report"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D18E1E]" />
            <span>{t('systemAudit')}</span>
          </button>

          {/* Profile Quick Avatar */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-[#202A24] hover:bg-[#FAF7EE] border border-[#E8DFCC] rounded-lg transition-colors"
            title="Open Profile"
            aria-label="User Profile"
          >
            <div className="w-6 h-6 rounded-full bg-[#174B32] text-white flex items-center justify-center text-xs font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden md:inline truncate max-w-[100px]">
              {user.name ? user.name.split(' ')[0] : t('navProfile')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
