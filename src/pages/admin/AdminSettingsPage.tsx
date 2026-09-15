import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Database,
  ShieldCheck,
  Building,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Activity,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, isConfiguredWithSupabase, testConnection } = useEstate();

  const [form, setForm] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState<'brand' | 'about' | 'contact' | 'visiting' | 'database'>('brand');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live API Connection testing state
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{
    tested: boolean;
    configured: boolean;
    connected: boolean;
    message: string;
    latencyMs?: number;
    tablesVerified?: string[];
  } | null>(null);

  const handleTestApi = async () => {
    setIsTestingApi(true);
    try {
      const result = await testConnection();
      setApiTestResult({ tested: true, ...result });
    } catch (err: any) {
      setApiTestResult({
        tested: true,
        configured: false,
        connected: false,
        message: err.message || 'API test encountered an unexpected error',
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateSettings(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'brand', label: 'Estate Identity', icon: Building },
    { id: 'about', label: 'Philosophy & About', icon: Sparkles },
    { id: 'contact', label: 'Contact & Location', icon: Mail },
    { id: 'visiting', label: 'Visiting Protocol', icon: Calendar },
    { id: 'database', label: 'Database & Sync', icon: Database },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {/* Sticky Header with Quick Save */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#B7B0A4]/30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block">
            System Configuration
          </span>
          <h1 className="font-serif text-lg sm:text-xl md:text-2xl text-[#20201E] tracking-tight">
            Estate & Website Settings
          </h1>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 flex items-center space-x-1 mr-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved successfully</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[38px] font-medium shadow-xs"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#B7B0A4]/30">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 sm:px-4 py-2.5 text-xs uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 border-b-2 -mb-[2px] min-h-[40px] ${
                  isActive
                    ? 'border-[#24362D] text-[#24362D] font-bold bg-white'
                    : 'border-transparent text-[#73716B] hover:text-[#20201E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Brand & Identity */}
        {activeTab === 'brand' && (
          <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
              Estate Identity & Public Presentation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Estate / Brand Name
                </label>
                <input
                  type="text"
                  value={form.estate_name || ''}
                  onChange={(e) => handleChange('estate_name', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Estate Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={form.estate_subtitle || ''}
                  onChange={(e) => handleChange('estate_subtitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                Breeding & Operational Philosophy Synopsis
              </label>
              <textarea
                rows={3}
                value={form.philosophy || ''}
                onChange={(e) => handleChange('philosophy', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: About Narrative */}
        {activeTab === 'about' && (
          <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
              Estate History, Heritage & Facilities Overview
            </h3>

            <div className="space-y-4">
              <RichTextEditor
                label="Full About Story & Heritage Chronicle"
                value={form.about_text || ''}
                onChange={(val) => handleChange('about_text', val)}
                rows={12}
              />

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Facilities & Grounds Overview
                </label>
                <textarea
                  rows={4}
                  value={form.facilities || ''}
                  onChange={(e) => handleChange('facilities', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
              Contact Channels & Regional Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Director Contact Email
                </label>
                <input
                  type="email"
                  value={form.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Direct Telephone / WhatsApp
                </label>
                <input
                  type="text"
                  value={form.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                Estate Postal Address & Geographic Location
              </label>
              <textarea
                rows={2}
                value={form.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Visiting Protocol */}
        {activeTab === 'visiting' && (
          <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
              Private Visiting Protocol & Bio-Security Guidelines
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                  Visiting Protocol (Displayed on Contact & Viewing request page)
                </label>
                <textarea
                  rows={4}
                  value={form.visiting_protocol || ''}
                  onChange={(e) => handleChange('visiting_protocol', e.target.value)}
                  placeholder="e.g. By confirmed private appointment only. Strict bio-security protocols..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Database & Persistence */}
        {activeTab === 'database' && (
          <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#B7B0A4]/20 pb-2">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Persistence & Storage Layer</span>
              </h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  isConfiguredWithSupabase
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {isConfiguredWithSupabase ? 'Supabase Connected' : 'Estate Store Active'}
              </span>
            </div>

            <p className="text-xs text-[#73716B] leading-relaxed">
              {isConfiguredWithSupabase
                ? 'Your estate database is actively connected to Supabase Cloud PostgreSQL, with full Row Level Security (RLS) policies and storage bucket uploads.'
                : 'All studbook records, rescue dossiers, journal entries, client inquiries, and settings are currently stored with client persistence. To link a production Supabase instance, supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment configuration.'}
            </p>

            <div className="p-4 bg-[#FAF9F6] border border-[#B7B0A4]/30 space-y-2 text-xs">
              <span className="font-serif text-sm text-[#20201E] font-medium block">
                Database Schema Features
              </span>
              <ul className="space-y-1 text-[#73716B] list-disc list-inside">
                <li>Strict Studbook Registry with 3-generation pedigrees & FEI passports</li>
                <li>Rescue Sanctuary timeline with chronological progress milestones</li>
                <li>Estate Journal editorial CMS with SEO metadata tags</li>
                <li>Inquiry Inbox with status workflow (new, read, replied, archived)</li>
              </ul>
            </div>

            {/* API Diagnostic & Verification Tool */}
            <div className="p-4 border border-[#B7B0A4]/35 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-serif font-medium text-[#20201E] flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5 text-[#A89472]" />
                    <span>API Health & Connectivity Test</span>
                  </h4>
                  <p className="text-[11px] text-[#73716B]">
                    Query the database endpoints directly to verify live read/write readiness.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={isTestingApi}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-[#24362D] text-white hover:bg-[#1b2821] transition-colors disabled:opacity-50 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${isTestingApi ? 'animate-spin' : ''}`} />
                  <span>{isTestingApi ? 'Testing API...' : 'Test API Connection'}</span>
                </button>
              </div>

              {apiTestResult && (
                <div
                  className={`p-3 text-xs border ${
                    apiTestResult.connected
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : apiTestResult.configured
                      ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                      : 'bg-[#FAF9F6] border-[#B7B0A4]/40 text-[#20201E]'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {apiTestResult.connected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium text-xs">{apiTestResult.message}</p>
                      {apiTestResult.latencyMs !== undefined && (
                        <p className="text-[11px] text-gray-500">
                          Roundtrip API latency: {apiTestResult.latencyMs} ms
                        </p>
                      )}
                      {apiTestResult.tablesVerified && (
                        <p className="text-[11px] text-gray-500">
                          Verified endpoints: {apiTestResult.tablesVerified.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#B7B0A4]/20">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[42px] font-medium shadow-xs"
          >
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
