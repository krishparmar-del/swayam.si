import React from 'react';
import { 
  Home, 
  GraduationCap, 
  Landmark, 
  FolderCheck, 
  User, 
  CircleHelp, 
  ShieldCheck,
  BookmarkCheck,
  MapPin
} from 'lucide-react';
import { useI18n } from '../../i18n/LanguageContext';
import { UserProfile } from '../../types/profile';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuditModal?: () => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onOpenAuditModal, user }) => {
  const { t } = useI18n();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'exams', label: t('navExams'), icon: GraduationCap },
    { id: 'schemes', label: t('navSchemes'), icon: Landmark },
    { id: 'centers', label: 'Exam Centers & Kiosks', icon: MapPin },
    { id: 'documents', label: t('navDocuments'), icon: FolderCheck },
    { id: 'profile', label: t('navProfile'), icon: User },
    { id: 'faq', label: t('navFaq'), icon: CircleHelp },
  ];

  const savedCount = user.savedOpportunityIds?.length || 0;

  return (
    <aside className="w-64 bg-[#FFFDF7] border-r border-[#EDE6D6] hidden md:flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#174B32] text-white shadow-xs font-semibold'
                    : 'text-[#3E4D43] hover:text-[#174B32] hover:bg-[#FAF7EE]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2A93B]' : 'text-[#6C8072]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Saved Items badge if any */}
        {savedCount > 0 && (
          <div className="pt-2 border-t border-[#EDE6D6]">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#174B32] bg-[#EBF5EE] hover:bg-[#E2EFE7] transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#277448]" />
                <span>Saved Opportunities</span>
              </div>
              <span className="font-bold bg-white text-[#174B32] px-2 py-0.5 rounded-md text-[11px] shadow-2xs">
                {savedCount}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Profile Status & Audit link */}
      <div className="space-y-3 pt-4 border-t border-[#EDE6D6]">
        {/* Audit link */}
        <button
          onClick={() => onNavigate('audit')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            currentView === 'audit'
              ? 'bg-[#FDF4E1] text-[#7A5B18] font-semibold border border-[#E9D7A5]'
              : 'text-[#66542A] hover:bg-[#FAF7EE]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#D18E1E]" />
          <span>System Audit Report</span>
        </button>

        {/* Privacy Note */}
        <div className="bg-[#FAF7EE] border border-[#E8DFCC] rounded-xl p-3 text-left">
          <p className="text-[11px] font-bold text-[#174B32] tracking-tight">
            Local Data Guarantee
          </p>
          <p className="text-[10px] text-[#6E7E73] mt-0.5 leading-snug">
            Your details remain stored safely in this browser.
          </p>
        </div>
      </div>
    </aside>
  );
};
