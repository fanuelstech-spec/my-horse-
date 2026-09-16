import React, { useState } from 'react';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, isAdmin, messages } = useEstate();

  const unreadCount = messages.filter((m) => m.status === 'new').length;

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Horses', path: '/horses' },
    { label: 'Rescue', path: '/rescue' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#B7B0A4]/25 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleLinkClick('/')}
          className="text-left group focus:outline-none"
          id="header-logo-btn"
        >
          <span className="block font-serif text-2xl sm:text-3xl tracking-[0.18em] text-[#20201E] font-normal uppercase">
            STERLING
          </span>
          <span className="block font-sans text-[9px] sm:text-[10px] tracking-[0.25em] text-[#73716B] uppercase mt-0.5">
            {settings.tagline}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-sm tracking-[0.08em] transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#20201E] font-medium'
                    : 'text-[#73716B] hover:text-[#20201E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#24362D]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAdmin && (
            <button
              onClick={() => handleLinkClick('/admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#24362D] bg-[#24362D]/10 hover:bg-[#24362D]/20 transition-colors border border-[#24362D]/20 rounded"
              title="Admin Estate Office"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Office</span>
              {unreadCount > 0 && (
                <span className="ml-1 w-2 h-2 rounded-full bg-[#A89472]" />
              )}
            </button>
          )}

          <button
            onClick={() => handleLinkClick('/horses')}
            className="group inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-[0.15em] border border-[#20201E] text-[#20201E] hover:bg-[#20201E] hover:text-[#FAF9F6] transition-all duration-300"
            id="header-view-horses-cta"
          >
            <span>View Horses</span>
            <ArrowRight className="w-3 h-3 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center space-x-3">
          {isAdmin && (
            <button
              onClick={() => handleLinkClick('/admin')}
              className="p-2 text-[#24362D]"
              aria-label="Admin Office"
            >
              <Shield className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#20201E] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#B7B0A4]/25 bg-[#FAF9F6] px-6 pt-6 pb-8 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left font-serif text-xl tracking-wider text-[#20201E] py-2 border-b border-[#B7B0A4]/20"
            >
              Overview
            </button>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className="text-left font-serif text-xl tracking-wider text-[#20201E] py-2 border-b border-[#B7B0A4]/20"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('/horses')}
              className="w-full py-3 text-center text-xs uppercase tracking-[0.16em] bg-[#24362D] text-[#FAF9F6]"
            >
              View Available Horses
            </button>
          </div>

          <div className="pt-4 text-xs text-[#73716B] space-y-1">
            <p>{settings.visiting_hours}</p>
            <p>{settings.phone}</p>
          </div>
        </div>
      )}
    </header>
  );
};
