import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Compass,
  Heart,
  BookOpen,
  Mail,
  Settings,
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  X,
  ChevronRight,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen = false,
  onClose,
}) => {
  const { messages, logout, currentUser, isConfiguredWithSupabase } = useEstate();
  const unreadCount = messages.filter((m) => m.status === 'new').length;

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Horses', path: '/admin/horses', icon: Compass },
    { label: 'Rescue Program', path: '/admin/rescue', icon: Heart },
    { label: 'Estate Journal', path: '/admin/journal', icon: BookOpen },
    {
      label: 'Enquiries',
      path: '/admin/contact',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#20201E] text-[#FAF9F6]">
      <div className="flex-1 overflow-y-auto">
        {/* Estate Admin Header */}
        <div className="p-5 sm:p-6 border-b border-[#73716B]/20 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#A89472] text-[11px] uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Estate Office</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl tracking-wider text-white mt-1">
              STERLING
            </h2>
            <p className="text-[11px] text-[#73716B] mt-0.5 truncate max-w-[190px]">
              {currentUser?.email || 'admin@sterlinghorsesales.com'}
            </p>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-[#B7B0A4] hover:text-white rounded hover:bg-[#2A2A28] focus:outline-none focus:ring-1 focus:ring-[#A89472]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Database Mode Status */}
        <div className="mx-3.5 sm:mx-4 my-3 px-3 py-2 bg-[#2A2A28] border border-[#73716B]/30 text-[11px] text-[#B7B0A4] rounded flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConfiguredWithSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-[#A89472]'
              }`}
            />
            <span className="font-medium">
              {isConfiguredWithSupabase ? 'Supabase Live' : 'Estate Store'}
            </span>
          </div>
          <span className="text-[10px] text-[#73716B] font-mono">v1.2</span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 sm:py-3 space-y-1">
          {links.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path !== '/admin' && currentPath.startsWith(link.path));
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full flex items-center justify-between px-3.5 py-3 text-xs uppercase tracking-wider rounded transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-[#24362D] text-white font-medium shadow-sm'
                    : 'text-[#B7B0A4] hover:bg-[#2A2A28] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 opacity-90 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {link.badge !== undefined && (
                    <span className="bg-[#A89472] text-[#20201E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-3.5 sm:p-4 border-t border-[#73716B]/20 space-y-1.5 bg-[#1C1C1A]">
        <button
          onClick={() => {
            if (onClose) onClose();
            onNavigate('/');
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-[#B7B0A4] hover:text-white transition-colors rounded hover:bg-[#2A2A28] min-h-[40px]"
        >
          <span className="flex items-center space-x-2">
            <span>View Public Estate</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={async () => {
            if (onClose) onClose();
            await logout();
            onNavigate('/');
          }}
          className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-xs text-rose-300/80 hover:text-rose-200 transition-colors rounded hover:bg-rose-950/20 min-h-[40px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#20201E] text-[#FAF9F6] min-h-screen flex-col justify-between border-r border-[#73716B]/20 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay and Sliding Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#20201E] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
