import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  ExternalLink,
  Reply,
  X,
  Phone,
  ArrowLeft,
  Download,
  Calendar,
  User,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ContactMessage } from '../../types/database';

interface AdminMessagesPageProps {
  onNavigate: (path: string) => void;
}

export const AdminMessagesPage: React.FC<AdminMessagesPageProps> = ({ onNavigate }) => {
  const { messages, updateMessageStatus, deleteMessage } = useEstate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      (m.horse_name && m.horse_name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') {
      await updateMessageStatus(msg.id, 'read');
    }
  };

  const handleSetStatus = async (id: string, status: ContactMessage['status']) => {
    await updateMessageStatus(id, status);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  // Export inquiries to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Horse Reference', 'Status', 'Message'];
    const rows = filteredMessages.map((m) => [
      `"${new Date(m.created_at).toLocaleString()}"`,
      `"${m.name}"`,
      `"${m.email}"`,
      `"${m.phone || ''}"`,
      `"${m.subject.replace(/"/g, '""')}"`,
      `"${m.horse_name || ''}"`,
      `"${m.status}"`,
      `"${m.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `montrose-inquiries-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterTabs = [
    { id: 'all', label: 'All Enquiries', count: messages.length },
    {
      id: 'new',
      label: 'Unread',
      count: messages.filter((m) => m.status === 'new').length,
      highlight: true,
    },
    { id: 'read', label: 'Read', count: messages.filter((m) => m.status === 'read').length },
    { id: 'replied', label: 'Replied', count: messages.filter((m) => m.status === 'replied').length },
    { id: 'archived', label: 'Archived', count: messages.filter((m) => m.status === 'archived').length },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <AdminHeader
        category="Communications & Enquiries"
        title="Client Correspondence"
        subtitle="Manage prospective buyer inquiries, private viewing requests, and sanctuary sponsorship communications."
      >
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#B7B0A4]/40 text-[#20201E] text-xs uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors min-h-[38px] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </AdminHeader>

      <div className="px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Status Filter Tabs (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 sm:px-4 py-2 text-xs uppercase tracking-wider rounded-none whitespace-nowrap transition-colors flex items-center space-x-2 min-h-[38px] ${
                  isActive
                    ? 'bg-[#24362D] text-white font-medium shadow-xs'
                    : 'bg-white border border-[#B7B0A4]/35 text-[#73716B] hover:text-[#20201E] hover:border-[#20201E]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.highlight && tab.count > 0
                      ? 'bg-[#A89472] text-white'
                      : 'bg-[#FAF9F6] text-[#73716B]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by sender name, email, subject, or horse reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-[#73716B] hover:text-[#20201E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Messages */}
          {/* On mobile: if selectedMessage is active, hide list so detail takes full focus */}
          <div
            className={`space-y-2 lg:col-span-5 ${
              selectedMessage ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#73716B] px-1 pb-1">
              <span>{filteredMessages.length} Messages</span>
              <span>Select to view details & reply</span>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-0.5">
              {filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#24362D] ring-1 ring-[#24362D] shadow-sm'
                        : msg.status === 'new'
                        ? 'bg-white border-[#A89472]/60 shadow-xs'
                        : 'bg-white border-[#B7B0A4]/35 hover:border-[#73716B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-serif text-sm text-[#20201E] font-medium truncate">
                            {msg.name}
                          </span>
                          {msg.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-[#A89472] shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#73716B] block truncate">
                          {msg.email}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#73716B] shrink-0 font-mono">
                        {new Date(msg.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-serif text-[#20201E] mt-2 line-clamp-1 italic">
                      "{msg.subject}"
                    </p>

                    <p className="text-xs text-[#73716B] line-clamp-2 mt-1 font-light leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#B7B0A4]/20 flex items-center justify-between">
                      {msg.horse_name ? (
                        <span className="text-[10px] px-2 py-0.5 bg-[#A89472]/15 text-[#6B5A3E] font-medium rounded truncate max-w-[170px]">
                          Re: {msg.horse_name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#73716B]">General Inquiry</span>
                      )}

                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          msg.status === 'new'
                            ? 'bg-[#A89472]/20 text-[#6B5A3E] font-bold'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700'
                            : msg.status === 'archived'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="p-8 bg-white border border-[#B7B0A4]/35 text-center text-xs text-[#73716B]">
                  No messages found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Message Detail View */}
          {/* On mobile: if selectedMessage is active, shows full width with back button */}
          <div
            className={`lg:col-span-7 ${
              selectedMessage ? 'block' : 'hidden lg:block'
            }`}
          >
            {selectedMessage ? (
              <div className="bg-white border border-[#B7B0A4]/35 p-5 sm:p-7 space-y-6 shadow-xs animate-in fade-in duration-150">
                {/* Mobile Back Button */}
                <div className="lg:hidden pb-3 border-b border-[#B7B0A4]/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#24362D] font-medium py-1 px-2 -ml-2 rounded hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Inquiries List</span>
                  </button>
                  <span className="text-[11px] text-[#73716B]">
                    Status: <strong className="uppercase">{selectedMessage.status}</strong>
                  </span>
                </div>

                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#B7B0A4]/25">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl sm:text-2xl text-[#20201E]">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#73716B] pt-1">
                      <span className="flex items-center space-x-1 font-medium text-[#20201E]">
                        <User className="w-3.5 h-3.5 text-[#A89472]" />
                        <span>{selectedMessage.name}</span>
                      </span>
                      <span>·</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-[#24362D] underline hover:text-[#18241e]"
                      >
                        {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <>
                          <span>·</span>
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-[#A89472]" />
                            <a
                              href={`tel:${selectedMessage.phone}`}
                              className="text-[#24362D] hover:underline"
                            >
                              {selectedMessage.phone}
                            </a>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-[#73716B] sm:text-right shrink-0">
                    <div className="flex items-center sm:justify-end space-x-1">
                      <Calendar className="w-3 h-3 text-[#A89472]" />
                      <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="block font-mono text-[10px]">
                      {new Date(selectedMessage.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Referenced Horse or Topic */}
                {selectedMessage.horse_name && (
                  <div className="p-3.5 bg-[#FAF9F6] border border-[#B7B0A4]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-semibold block">
                        Direct Inquiry Regarding
                      </span>
                      <span className="font-serif text-sm font-medium text-[#20201E]">
                        {selectedMessage.horse_name}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('/admin/horses')}
                      className="inline-flex items-center space-x-1 text-xs text-[#24362D] hover:underline self-start sm:self-auto"
                    >
                      <span>View in Studbook</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Message Body */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#73716B] font-semibold block">
                    Message Transcription
                  </span>
                  <div className="p-4 sm:p-5 bg-[#FAF9F6] border border-[#B7B0A4]/20 rounded-none text-xs sm:text-sm text-[#20201E] leading-relaxed whitespace-pre-wrap font-serif">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Workflow Status Controls */}
                <div className="space-y-3 pt-3 border-t border-[#B7B0A4]/25">
                  <span className="text-[10px] uppercase tracking-wider text-[#73716B] font-semibold block">
                    Inquiry Workflow Status
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSetStatus(selectedMessage.id, 'read')}
                      className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded border min-h-[34px] ${
                        selectedMessage.status === 'read'
                          ? 'bg-[#24362D] text-white border-[#24362D]'
                          : 'bg-white border-[#B7B0A4]/40 text-[#73716B] hover:text-[#20201E]'
                      }`}
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => handleSetStatus(selectedMessage.id, 'replied')}
                      className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded border min-h-[34px] ${
                        selectedMessage.status === 'replied'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white border-[#B7B0A4]/40 text-[#73716B] hover:text-[#20201E]'
                      }`}
                    >
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => handleSetStatus(selectedMessage.id, 'archived')}
                      className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded border min-h-[34px] ${
                        selectedMessage.status === 'archived'
                          ? 'bg-gray-700 text-white border-gray-700'
                          : 'bg-white border-[#B7B0A4]/40 text-[#73716B] hover:text-[#20201E]'
                      }`}
                    >
                      Archive
                    </button>
                  </div>
                </div>

                {/* Direct Reply Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-[#B7B0A4]/25">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                        `Re: ${selectedMessage.subject} - Sterling Horse Sales`
                      )}&body=${encodeURIComponent(
                        `Dear ${selectedMessage.name},\n\nThank you for contacting Sterling Horse Sales regarding ${
                          selectedMessage.horse_name || 'your inquiry'
                        }.\n\n\n\nKind regards,\nSterling Estate Office\nhttps://sterlinghorsesales.com`
                      )}`}
                      onClick={() => handleSetStatus(selectedMessage.id, 'replied')}
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors font-medium min-h-[40px]"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {selectedMessage.phone && (
                      <a
                        href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-white border border-[#B7B0A4]/40 text-[#20201E] text-xs uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors min-h-[40px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="inline-flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-800 py-2 px-3 hover:bg-rose-50 rounded self-start sm:self-auto min-h-[40px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Enquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#B7B0A4]/35 p-12 text-center text-[#73716B] space-y-3">
                <Mail className="w-10 h-10 text-[#A89472] mx-auto opacity-50" />
                <h3 className="font-serif text-lg text-[#20201E]">Select an Enquiry</h3>
                <p className="text-xs text-[#73716B] max-w-sm mx-auto">
                  Select any inquiry from the left to view detailed client requests, contact info, and compose direct replies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
