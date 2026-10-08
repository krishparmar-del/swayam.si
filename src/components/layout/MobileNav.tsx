import React from 'react';
import { Home, GraduationCap, Landmark, FolderCheck, User } from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'exams', label: t('navExams'), icon: GraduationCap },
    { id: 'schemes', label: t('navSchemes'), icon: Landmark },
    { id: 'documents', label: 'Wallet', icon: FolderCheck },
    { id: 'profile', label: t('navProfile'), icon: User },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF7]/98 backdrop-blur-md border-t border-[#EDE6D6] px-2 py-1 shadow-lg max-h-[14vh]"
    >
      <div className="flex items-center justify-around h-13">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors ${
                isActive ? 'text-[#174B32]' : 'text-[#6C8072] hover:text-[#174B32]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px] text-[#174B32]' : 'stroke-[1.8px]'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-[#174B32]' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
