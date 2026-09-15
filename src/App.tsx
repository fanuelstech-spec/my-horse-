import React, { useState, useEffect } from 'react';
import { EstateProvider, useEstate } from './lib/estateContext';
import { Header } from './components/public/Header';
import { Footer } from './components/public/Footer';

// Public pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HorsesPage } from './pages/HorsesPage';
import { HorseDetailPage } from './pages/HorseDetailPage';
import { RescuePage } from './pages/RescuePage';
import { RescueDetailPage } from './pages/RescueDetailPage';
import { JournalPage } from './pages/JournalPage';
import { JournalDetailPage } from './pages/JournalDetailPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';

// Admin pages & components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminHorsesPage } from './pages/admin/AdminHorsesPage';
import { AdminRescuePage } from './pages/admin/AdminRescuePage';
import { AdminJournalPage } from './pages/admin/AdminJournalPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function EstateAppContent() {
  const { isAdmin, horses, rescues, journal } = useEstate();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    let urlPath = path;
    let queryString = '';

    if (path.includes('?')) {
      const parts = path.split('?');
      urlPath = parts[0];
      queryString = parts[1];
    }

    try {
      window.history.pushState({}, '', path);
    } catch {
      // In some sandboxed iframe environments, history.pushState might be restricted
    }

    setCurrentPath(urlPath);
    setSearchParams(new URLSearchParams(queryString));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Admin View Handling
  if (isAdminRoute) {
    if (!isAdmin && currentPath !== '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/admin' && <AdminDashboard onNavigate={navigate} />}
        {currentPath.startsWith('/admin/horses') && (
          <AdminHorsesPage
            initialAction={searchParams.get('action')}
            onNavigate={navigate}
          />
        )}
        {currentPath.startsWith('/admin/rescue') && (
          <AdminRescuePage
            initialAction={searchParams.get('action')}
            onNavigate={navigate}
          />
        )}
        {currentPath.startsWith('/admin/journal') && (
          <AdminJournalPage
            initialAction={searchParams.get('action')}
            onNavigate={navigate}
          />
        )}
        {currentPath.startsWith('/admin/contact') && (
          <AdminMessagesPage onNavigate={navigate} />
        )}
        {currentPath.startsWith('/admin/settings') && <AdminSettingsPage />}
      </AdminLayout>
    );
  }

  // Public View Routing
  const renderPublicPage = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '/home') {
      return <HomePage onNavigate={navigate} />;
    }

    // 2. About
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // 3. Horses
    if (currentPath === '/horses') {
      return <HorsesPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/horses/') || currentPath.startsWith('/horse/')) {
      const prefix = currentPath.startsWith('/horses/') ? '/horses/' : '/horse/';
      const rawSlug = currentPath.slice(prefix.length).replace(/\/$/, '');
      const slugOrId = decodeURIComponent(rawSlug.split('?')[0]);
      const horse =
        horses.find(
          (h) =>
            h.slug === slugOrId ||
            h.id === slugOrId ||
            h.slug?.toLowerCase() === slugOrId.toLowerCase() ||
            h.id?.toLowerCase() === slugOrId.toLowerCase() ||
            h.name?.toLowerCase().replace(/\s+/g, '-') === slugOrId.toLowerCase()
        );
      return <HorseDetailPage slug={slugOrId} horse={horse} onNavigate={navigate} />;
    }

    // 4. Rescue
    if (currentPath === '/rescue' || currentPath === '/rescues') {
      return <RescuePage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/rescue/') || currentPath.startsWith('/rescues/')) {
      const prefix = currentPath.startsWith('/rescues/') ? '/rescues/' : '/rescue/';
      const rawSlug = currentPath.slice(prefix.length).replace(/\/$/, '');
      const slugOrId = decodeURIComponent(rawSlug.split('?')[0]);
      const rescue =
        rescues.find(
          (r) =>
            r.slug === slugOrId ||
            r.id === slugOrId ||
            r.slug?.toLowerCase() === slugOrId.toLowerCase() ||
            r.id?.toLowerCase() === slugOrId.toLowerCase() ||
            r.name?.toLowerCase().replace(/\s+/g, '-') === slugOrId.toLowerCase()
        );
      return <RescueDetailPage slug={slugOrId} rescue={rescue} onNavigate={navigate} />;
    }

    // 5. Journal
    if (currentPath === '/journal' || currentPath === '/news' || currentPath === '/stories') {
      return <JournalPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/journal/') || currentPath.startsWith('/news/') || currentPath.startsWith('/story/')) {
      const prefixMatch = currentPath.match(/^(\/journal\/|\/news\/|\/story\/)/);
      const prefix = prefixMatch ? prefixMatch[0] : '/journal/';
      const rawSlug = currentPath.slice(prefix.length).replace(/\/$/, '');
      const slugOrId = decodeURIComponent(rawSlug.split('?')[0]);
      const post =
        journal.find(
          (p) =>
            p.slug === slugOrId ||
            p.id === slugOrId ||
            p.slug?.toLowerCase() === slugOrId.toLowerCase() ||
            p.id?.toLowerCase() === slugOrId.toLowerCase() ||
            p.title?.toLowerCase().replace(/\s+/g, '-') === slugOrId.toLowerCase()
        );
      return <JournalDetailPage slug={slugOrId} post={post} onNavigate={navigate} />;
    }

    // 6. Contact
    if (currentPath === '/contact') {
      return (
        <ContactPage
          initialHorse={searchParams.get('horse') || undefined}
          initialHorseId={searchParams.get('horse_id') || undefined}
          initialSubject={searchParams.get('subject') || undefined}
          onNavigate={navigate}
        />
      );
    }

    // 7. Legal
    if (currentPath === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }

    // Fallback to Home
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#20201E]">
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">{renderPublicPage()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <EstateProvider>
      <EstateAppContent />
    </EstateProvider>
  );
}
