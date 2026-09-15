import React, { useState } from 'react';
import { Menu, ShieldCheck, ArrowUpRight, Bell } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { useEstate } from '../../lib/estateContext';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { messages, isConfiguredWithSupabase } = useEstate();
  const unreadMessages = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      {/* Sidebar Component (Handles both desktop docking and mobile slide-out drawer) */}
      <AdminSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile & Tablet Top Bar (Visible only on < lg screens) */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#20201E] text-white border-b border-[#73716B]/25 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-1 text-[#B7B0A4] hover:text-white rounded hover:bg-[#2A2A28] focus:outline-none focus:ring-1 focus:ring-[#A89472] relative min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#A89472] rounded-full ring-2 ring-[#20201E]" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A89472]" />
              <span className="font-serif text-lg tracking-wider text-white">
                STERLING
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A89472] border border-[#A89472]/40 px-1.5 py-0.5 rounded">
                Office
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {unreadMessages > 0 && (
              <button
                onClick={() => onNavigate('/admin/contact')}
                className="p-2 text-[#A89472] hover:text-white relative"
                title={`${unreadMessages} new enquiries`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 bg-[#A89472] text-[#20201E] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              </button>
            )}

            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#2A2A28] text-[#B7B0A4] hover:text-white text-xs uppercase tracking-wider rounded border border-[#73716B]/30"
              title="View Public Estate"
            >
              <span className="hidden xs:inline">Public</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#FAF9F6]">
          {children}
        </main>
      </div>
    </div>
  );
};
