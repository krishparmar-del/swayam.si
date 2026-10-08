import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { UserProfile } from '../../types/profile';

interface AppLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAuditModal: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  searchQuery,
  onSearchChange,
  onOpenAuditModal,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#202A24] flex flex-col font-sans selection:bg-[#E2EFE7]">
      {/* Persistent Top Bar Header (Adhering to Top Bar Contract) */}
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        activeNav={currentView}
        onNavigate={onNavigate}
        onAuditClick={onOpenAuditModal}
        onProfileClick={() => onNavigate('profile')}
      />

      {/* Main Body Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={onNavigate}
          onOpenAuditModal={onOpenAuditModal}
          user={user}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-5xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Adhering to 15% sticky cap) */}
      <MobileNav
        currentView={currentView}
        onNavigate={onNavigate}
      />
    </div>
  );
};
