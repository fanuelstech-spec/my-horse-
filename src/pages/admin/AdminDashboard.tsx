import React from 'react';
import {
  Compass,
  Heart,
  BookOpen,
  Mail,
  Plus,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  Database,
  Calendar,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusBadge } from '../../components/public/StatusBadge';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { horses, rescues, journal, messages, updateMessageStatus, isConfiguredWithSupabase } = useEstate();

  const totalHorses = horses.length;
  const availableHorses = horses.filter((h) => h.status === 'Available').length;
  const rescuesInCare = rescues.filter((r) => r.status === 'In Rehabilitation' || r.status === 'Sanctuary').length;
  const publishedArticles = journal.filter((j) => j.published).length;
  const newMessages = messages.filter((m) => m.status === 'new');

  // Total valuation of listed sport horses
  const totalValuation = horses.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const stats = [
    {
      label: 'Horses Registered',
      value: totalHorses,
      sub: `${availableHorses} currently available`,
      icon: Compass,
      link: '/admin/horses',
      actionText: 'Manage Studbook',
    },
    {
      label: 'Sanctuary In Care',
      value: rescuesInCare,
      sub: `${rescues.length} total cases recorded`,
      icon: Heart,
      link: '/admin/rescue',
      actionText: 'View Sanctuary',
    },
    {
      label: 'Journal Articles',
      value: publishedArticles,
      sub: `${journal.length} entries written`,
      icon: BookOpen,
      link: '/admin/journal',
      actionText: 'Review Articles',
    },
    {
      label: 'New Enquiries',
      value: newMessages.length,
      sub: `${messages.length} total received`,
      icon: Mail,
      link: '/admin/contact',
      actionText: 'Open Inbox',
      highlight: newMessages.length > 0,
    },
  ];

  const recentHorses = horses.slice(0, 4);
  const recentMessages = messages.slice(0, 5);

  // Quick backup / export of estate database in JSON
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      estate: 'Montrose Equestrian Estate',
      horses,
      rescues,
      journal,
      messagesCount: messages.length,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `montrose-estate-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      <AdminHeader
        category="Director Overview"
        title="Estate Operations Dashboard"
        subtitle="Operational metrics, studbook status, prospective buyer communications, and publishing shortcuts."
      >
        <button
          onClick={handleExportBackup}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#B7B0A4]/40 text-[#20201E] text-xs uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors min-h-[38px] cursor-pointer"
          title="Export estate database JSON backup"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Backup</span>
          <span className="sm:hidden">Backup</span>
        </button>
      </AdminHeader>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* KPI Cards Grid - Full Responsive on all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(stat.link)}
                className={`p-5 sm:p-6 bg-white border cursor-pointer hover:border-[#20201E] transition-all group flex flex-col justify-between shadow-xs ${
                  stat.highlight
                    ? 'border-[#A89472] ring-1 ring-[#A89472]/40 bg-[#FAF9F6]/40'
                    : 'border-[#B7B0A4]/35'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[#73716B]">
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      {stat.label}
                    </span>
                    <div className="p-1.5 bg-[#FAF9F6] rounded-sm">
                      <Icon className="w-4 h-4 text-[#A89472]" />
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
                    <span className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal tracking-tight">
                      {stat.value}
                    </span>
                    {stat.highlight && (
                      <span className="text-[10px] bg-[#A89472] text-white px-2 py-0.5 rounded-full font-bold">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#73716B] mt-1 font-light truncate">
                    {stat.sub}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-[#B7B0A4]/20 flex items-center justify-between text-[11px] text-[#73716B] group-hover:text-[#20201E]">
                  <span className="font-medium">{stat.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Publishing Actions Strip */}
        <div className="p-4 sm:p-6 bg-white border border-[#B7B0A4]/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A89472] font-semibold block">
              Direct Publishing
            </span>
            <h3 className="font-serif text-lg sm:text-xl text-[#20201E] mt-0.5">
              Initiate New Estate Record
            </h3>
            <p className="text-xs text-[#73716B]">
              Add studbook sport horses, rescue milestones, or editorial essays directly
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => onNavigate('/admin/horses?action=new')}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 hover:bg-[#1c2a23] transition-colors min-h-[40px] font-medium"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Register Horse</span>
            </button>
            <button
              onClick={() => onNavigate('/admin/rescue?action=new')}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-white border border-[#B7B0A4]/50 text-[#20201E] text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 hover:bg-[#FAF9F6] transition-colors min-h-[40px] font-medium"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Record Rescue</span>
            </button>
            <button
              onClick={() => onNavigate('/admin/journal?action=new')}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-[#B7B0A4]/50 text-[#20201E] text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 hover:bg-[#FAF9F6] transition-colors min-h-[40px] font-medium"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Write Journal</span>
            </button>
          </div>
        </div>

        {/* Operational Status Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 bg-[#FAF9F6] border border-[#B7B0A4]/30 text-xs">
          <div className="flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-[#A89472] shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-[#73716B] tracking-wider block">
                Persistence Mode
              </span>
              <span className="font-medium text-[#20201E]">
                {isConfiguredWithSupabase ? 'Supabase Cloud Sync' : 'Local State Engine'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="w-4 h-4 text-[#A89472] shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-[#73716B] tracking-wider block">
                Catalog Listed Value
              </span>
              <span className="font-medium text-[#20201E]">
                EUR {totalValuation.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-[#A89472] shrink-0" />
            <div>
              <span className="text-[10px] uppercase text-[#73716B] tracking-wider block">
                Estate Location
              </span>
              <span className="font-medium text-[#20201E]">
                Normandy, Pays d'Auge
              </span>
            </div>
          </div>
        </div>

        {/* Two Columns: Recent Inquiries & Horses Inventory Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Recent Inquiries */}
          <div className="lg:col-span-7 bg-white border border-[#B7B0A4]/35 p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#B7B0A4]/25 pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-[#20201E]">
                  Latest Client Inquiries
                </h3>
                <p className="text-xs text-[#73716B]">
                  Communications from prospective owners and sanctuary patrons
                </p>
              </div>
              <button
                onClick={() => onNavigate('/admin/contact')}
                className="text-xs text-[#24362D] uppercase tracking-wider font-medium hover:underline shrink-0"
              >
                Inbox ({messages.length}) →
              </button>
            </div>

            {recentMessages.length > 0 ? (
              <div className="divide-y divide-[#B7B0A4]/20">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onNavigate('/admin/contact')}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 hover:bg-[#FAF9F6]/80 p-2 -mx-2 rounded transition-colors cursor-pointer"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-xs text-[#20201E]">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-[#73716B] truncate max-w-[180px]">
                          ({msg.email})
                        </span>
                        {msg.horse_name && (
                          <span className="px-1.5 py-0.5 bg-[#A89472]/15 text-[#6B5A3E] text-[10px] rounded font-medium">
                            Re: {msg.horse_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#20201E] font-serif italic truncate">
                        "{msg.subject}"
                      </p>
                      <p className="text-xs text-[#73716B] line-clamp-1 font-light">
                        {msg.message}
                      </p>
                      <span className="text-[10px] text-[#73716B] block">
                        {new Date(msg.created_at).toLocaleDateString()} at{' '}
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          msg.status === 'new'
                            ? 'bg-[#A89472]/20 text-[#6B5A3E] font-bold'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-[#73716B]'
                        }`}
                      >
                        {msg.status}
                      </span>
                      {msg.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMessageStatus(msg.id, 'read');
                          }}
                          className="text-[10px] text-[#24362D] hover:underline"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#73716B] py-6 text-center italic font-serif">
                No inquiries recorded yet.
              </p>
            )}
          </div>

          {/* Current Inventory Snapshot */}
          <div className="lg:col-span-5 bg-white border border-[#B7B0A4]/35 p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#B7B0A4]/25 pb-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-[#20201E]">
                  Inventory Snapshot
                </h3>
                <p className="text-xs text-[#73716B]">
                  Recently updated horse profiles
                </p>
              </div>
              <button
                onClick={() => onNavigate('/admin/horses')}
                className="text-xs text-[#24362D] uppercase tracking-wider font-medium hover:underline shrink-0"
              >
                All ({horses.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentHorses.map((horse) => {
                const cover =
                  horse.images?.find((img) => img.is_cover)?.url ||
                  horse.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=300&q=80';
                return (
                  <div
                    key={horse.id}
                    onClick={() => onNavigate('/admin/horses')}
                    className="flex items-center space-x-3 p-2 bg-[#FAF9F6] border border-[#B7B0A4]/25 hover:border-[#20201E] cursor-pointer transition-colors"
                  >
                    <img
                      src={cover}
                      alt=""
                      className="w-12 h-10 object-cover border border-[#B7B0A4]/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-serif text-sm text-[#20201E] font-medium truncate">
                          {horse.name}
                        </span>
                        <StatusBadge status={horse.status} />
                      </div>
                      <span className="text-[11px] text-[#73716B] block truncate">
                        {horse.breed} · {horse.discipline} ·{' '}
                        {horse.price ? `EUR ${horse.price.toLocaleString()}` : 'Private'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
