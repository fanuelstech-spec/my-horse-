import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Check,
  X,
  Compass,
  ArrowLeft,
  LayoutGrid,
  List as ListIcon,
  Download,
  Save,
  Dna,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusBadge } from '../../components/public/StatusBadge';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { Horse, HorseSex, HorseStatus } from '../../types/database';

interface AdminHorsesPageProps {
  initialAction?: string | null;
  onNavigate: (path: string) => void;
}

export const AdminHorsesPage: React.FC<AdminHorsesPageProps> = ({ initialAction, onNavigate }) => {
  const { horses, saveHorse, deleteHorse } = useEstate();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [editingHorse, setEditingHorse] = useState<Horse | null>(null);
  const [isCreating, setIsCreating] = useState(initialAction === 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Auto detect mobile to set cards view as friendly default
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('cards');
    }
  }, []);

  useEffect(() => {
    if (initialAction === 'new') {
      handleStartCreate();
    }
  }, [initialAction]);

  const filteredHorses = horses.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.breed.toLowerCase().includes(search.toLowerCase()) ||
      h.discipline.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || h.status === filterStatus;
    const matchesDiscipline = filterDiscipline === 'all' || h.discipline.toLowerCase().includes(filterDiscipline.toLowerCase());
    return matchesSearch && matchesStatus && matchesDiscipline;
  });

  const handleStartCreate = () => {
    setEditingHorse({
      id: '',
      name: '',
      slug: '',
      breed: 'Selle Français',
      registration_number: null,
      sex: 'Mare',
      date_of_birth: null,
      age: 6,
      height: '16.3 hh (170 cm)',
      color: 'Bay',
      discipline: 'Showjumping',
      training_level: 'Schooling 1.30m',
      sire: '',
      dam: '',
      grand_sire_paternal: '',
      grand_dam_paternal: '',
      grand_sire_maternal: '',
      grand_dam_maternal: '',
      location: 'Normandy Main Barn',
      price: 85000,
      currency: 'EUR',
      status: 'Available',
      short_description: '',
      description: '',
      personality: '',
      training: '',
      competition_history: '',
      bloodline: '',
      suitability: '',
      featured: false,
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
    });
    setIsCreating(true);
  };

  const handleStartEdit = (horse: Horse) => {
    setEditingHorse({ ...horse });
    setIsCreating(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingHorse || !editingHorse.name.trim()) return;

    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await saveHorse(editingHorse);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingHorse(null);
        setIsCreating(false);
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteHorse(id);
    setConfirmDeleteId(null);
    if (editingHorse?.id === id) {
      setEditingHorse(null);
    }
  };

  // Export inventory to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Breed', 'Sex', 'Age', 'Height', 'Discipline', 'Level', 'Status', 'Price', 'Currency', 'Sire', 'Dam', 'Location'];
    const rows = filteredHorses.map((h) => [
      `"${h.name}"`,
      `"${h.breed}"`,
      `"${h.sex}"`,
      h.age || '',
      `"${h.height || ''}"`,
      `"${h.discipline}"`,
      `"${h.training_level || ''}"`,
      `"${h.status}"`,
      h.price || '',
      h.currency || 'EUR',
      `"${h.sire || ''}"`,
      `"${h.dam || ''}"`,
      `"${h.location || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sterling-horses-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {/* Header */}
      {!editingHorse ? (
        <AdminHeader
          category="Studbook Management"
          title="Horse Inventory"
          subtitle="Manage breeding certificates, physical dimensions, 3-generation pedigrees, and acquisition statuses."
          actionLabel="Register New Horse"
          onAction={handleStartCreate}
        >
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#B7B0A4]/40 text-[#20201E] text-xs uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors min-h-[38px] cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </AdminHeader>
      ) : (
        /* Sticky Top Action Bar when editing */
        <div className="sticky top-0 z-20 bg-white border-b border-[#B7B0A4]/30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setEditingHorse(null);
                setIsCreating(false);
              }}
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] py-1.5 px-2.5 rounded hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-xl text-[#20201E] truncate">
                {isCreating ? 'Register New Horse' : `Editing: ${editingHorse.name}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setEditingHorse(null);
                setIsCreating(false);
              }}
              className="px-3.5 py-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] border border-[#B7B0A4]/35 hover:bg-[#FAF9F6] min-h-[38px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || !editingHorse.name.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[38px] font-medium shadow-xs"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Record</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* If Editing or Creating, Show the Detailed Form */}
        {editingHorse ? (
          <div className="bg-white border border-[#B7B0A4]/35 p-4 sm:p-8 lg:p-10 space-y-8 shadow-xs animate-in fade-in duration-150">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Primary Identity */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  1. Identification & Vital Statistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Horse Registered Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHorse.name}
                      onChange={(e) => setEditingHorse({ ...editingHorse, name: e.target.value })}
                      placeholder="e.g. Artemis de Sterling"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Breed / Studbook *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHorse.breed}
                      onChange={(e) => setEditingHorse({ ...editingHorse, breed: e.target.value })}
                      placeholder="e.g. KWPN, Selle Français, Hannoverian"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Sex *
                    </label>
                    <select
                      value={editingHorse.sex}
                      onChange={(e) => setEditingHorse({ ...editingHorse, sex: e.target.value as HorseSex })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    >
                      <option value="Mare">Mare</option>
                      <option value="Stallion">Stallion</option>
                      <option value="Gelding">Gelding</option>
                      <option value="Colt">Colt</option>
                      <option value="Filly">Filly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={editingHorse.age || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, age: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Height
                    </label>
                    <input
                      type="text"
                      value={editingHorse.height || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, height: e.target.value })}
                      placeholder="e.g. 16.3 hh (170 cm)"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Coat Color
                    </label>
                    <input
                      type="text"
                      value={editingHorse.color || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, color: e.target.value })}
                      placeholder="e.g. Dark Bay, Grey, Chestnut"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Passport / FEI Number
                    </label>
                    <input
                      type="text"
                      value={editingHorse.registration_number || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, registration_number: e.target.value })}
                      placeholder="e.g. 528003201804291"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Discipline *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingHorse.discipline}
                      onChange={(e) => setEditingHorse({ ...editingHorse, discipline: e.target.value })}
                      placeholder="e.g. Showjumping, Dressage, Eventing"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Training Level
                    </label>
                    <input
                      type="text"
                      value={editingHorse.training_level || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, training_level: e.target.value })}
                      placeholder="e.g. 1.30m Schooling / Grand Prix Potential"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Stabling / Barn Location
                    </label>
                    <input
                      type="text"
                      value={editingHorse.location || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, location: e.target.value })}
                      placeholder="e.g. Normandy Main Barn"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>
                </div>
              </div>

              {/* Commercial Valuation & Availability */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  2. Status & Commercial Positioning
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Availability Status *
                    </label>
                    <select
                      value={editingHorse.status}
                      onChange={(e) => setEditingHorse({ ...editingHorse, status: e.target.value as HorseStatus })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                      <option value="Not Currently Available">Not Currently Available</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Price (Leave blank for Private Application)
                    </label>
                    <input
                      type="number"
                      value={editingHorse.price || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, price: e.target.value ? Number(e.target.value) : null })}
                      placeholder="e.g. 145000"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Currency
                    </label>
                    <select
                      value={editingHorse.currency || 'EUR'}
                      onChange={(e) => setEditingHorse({ ...editingHorse, currency: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF (CHF)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                    <input
                      type="checkbox"
                      checked={editingHorse.published}
                      onChange={(e) => setEditingHorse({ ...editingHorse, published: e.target.checked })}
                      className="w-4 h-4 accent-[#24362D]"
                    />
                    <span className="font-medium">Published on Public Catalog</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                    <input
                      type="checkbox"
                      checked={editingHorse.featured}
                      onChange={(e) => setEditingHorse({ ...editingHorse, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#24362D]"
                    />
                    <span className="font-medium">Feature on Homepage Spotlight</span>
                  </label>
                </div>
              </div>

              {/* Pedigree Details - Responsive layout */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <div className="flex items-center justify-between border-b border-[#B7B0A4]/20 pb-2">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold flex items-center space-x-2">
                    <Dna className="w-4 h-4" />
                    <span>3. Three-Generation Pedigree Bloodlines</span>
                  </h3>
                  <span className="text-[10px] text-[#73716B]">Interactive tree on horse dossier</span>
                </div>

                {/* Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-[#FAF9F6] border border-[#B7B0A4]/30 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-bold block">
                      Sire (Father)
                    </span>
                    <input
                      type="text"
                      value={editingHorse.sire || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, sire: e.target.value })}
                      placeholder="e.g. Totilas, Cornet Obolensky"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                    />

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2 border-t border-[#B7B0A4]/20">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Paternal Grand Sire
                        </label>
                        <input
                          type="text"
                          value={editingHorse.grand_sire_paternal || ''}
                          onChange={(e) => setEditingHorse({ ...editingHorse, grand_sire_paternal: e.target.value })}
                          placeholder="e.g. Gribaldi"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#B7B0A4]/30 text-[#20201E] min-h-[34px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Paternal Grand Dam
                        </label>
                        <input
                          type="text"
                          value={editingHorse.grand_dam_paternal || ''}
                          onChange={(e) => setEditingHorse({ ...editingHorse, grand_dam_paternal: e.target.value })}
                          placeholder="e.g. Lominka"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#B7B0A4]/30 text-[#20201E] min-h-[34px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#FAF9F6] border border-[#B7B0A4]/30 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-bold block">
                      Dam (Mother)
                    </span>
                    <input
                      type="text"
                      value={editingHorse.dam || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, dam: e.target.value })}
                      placeholder="e.g. Donna Primera"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                    />

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2 border-t border-[#B7B0A4]/20">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Maternal Grand Sire
                        </label>
                        <input
                          type="text"
                          value={editingHorse.grand_sire_maternal || ''}
                          onChange={(e) => setEditingHorse({ ...editingHorse, grand_sire_maternal: e.target.value })}
                          placeholder="e.g. Donnerhall"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#B7B0A4]/30 text-[#20201E] min-h-[34px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Maternal Grand Dam
                        </label>
                        <input
                          type="text"
                          value={editingHorse.grand_dam_maternal || ''}
                          onChange={(e) => setEditingHorse({ ...editingHorse, grand_dam_maternal: e.target.value })}
                          placeholder="e.g. Cinderella"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#B7B0A4]/30 text-[#20201E] min-h-[34px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photographic Gallery */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  4. High-Resolution Photographic Gallery
                </h3>
                <ImageUploader
                  images={(editingHorse.images || []).map((img, i) => ({
                    id: img.id || `img-${i}`,
                    url: img.url,
                    caption: img.caption,
                    display_order: img.display_order,
                    is_cover: img.is_cover,
                  }))}
                  onChange={(imgs) => {
                    setEditingHorse({
                      ...editingHorse,
                      images: imgs.map((img, i) => ({
                        id: img.id,
                        horse_id: editingHorse.id,
                        url: img.url,
                        caption: img.caption || null,
                        display_order: i + 1,
                        is_cover: img.is_cover,
                        created_at: new Date().toISOString(),
                      })),
                    });
                  }}
                  bucket="horse-images"
                />
              </div>

              {/* Long-form Editorial Copy */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  5. Editorial Dossier & Copywriting
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Short Synopsis (Appears on cards & search overview)
                  </label>
                  <textarea
                    rows={2}
                    value={editingHorse.short_description || ''}
                    onChange={(e) => setEditingHorse({ ...editingHorse, short_description: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>

                <RichTextEditor
                  label="Detailed Overview & Athletic Scope"
                  value={editingHorse.description}
                  onChange={(val) => setEditingHorse({ ...editingHorse, description: val })}
                  rows={8}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Temperament & Personality
                    </label>
                    <textarea
                      rows={3}
                      value={editingHorse.personality || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, personality: e.target.value })}
                      placeholder="e.g. Inquisitive, bold, deeply affectionate in the stable..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Training & Development Progression
                    </label>
                    <textarea
                      rows={3}
                      value={editingHorse.training || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, training: e.target.value })}
                      placeholder="e.g. Carefully brought along with classical principles..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Show & Competition Record
                    </label>
                    <textarea
                      rows={3}
                      value={editingHorse.competition_history || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, competition_history: e.target.value })}
                      placeholder="e.g. Clear rounds at Fontainebleau Young Horse championships..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Rider Partnership Suitability
                    </label>
                    <textarea
                      rows={3}
                      value={editingHorse.suitability || ''}
                      onChange={(e) => setEditingHorse({ ...editingHorse, suitability: e.target.value })}
                      placeholder="e.g. Suited for an ambitious amateur or professional seeking..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#B7B0A4]/30">
                <button
                  type="button"
                  onClick={() => {
                    setEditingHorse(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] text-center min-h-[42px]"
                >
                  Cancel & Exit
                </button>

                <div className="flex items-center space-x-3">
                  {!isCreating && editingHorse.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(editingHorse.id)}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider text-rose-600 hover:bg-rose-50 border border-rose-200 min-h-[42px]"
                    >
                      Delete Horse
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[42px] font-medium shadow-xs text-center"
                  >
                    {isSaving ? 'Saving Record...' : 'Save Horse Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Inventory Controls & Data Display */
          <div className="space-y-4">
            {/* Filter & View Switcher Bar */}
            <div className="bg-white p-3.5 sm:p-4 border border-[#B7B0A4]/35 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, breed, or discipline..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2.5 text-[#73716B] hover:text-[#20201E]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                >
                  <option value="all">All Statuses ({horses.length})</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                  <option value="Not Currently Available">Not Available</option>
                </select>

                <select
                  value={filterDiscipline}
                  onChange={(e) => setFilterDiscipline(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                >
                  <option value="all">All Disciplines</option>
                  <option value="Showjumping">Showjumping</option>
                  <option value="Dressage">Dressage</option>
                  <option value="Eventing">Eventing</option>
                </select>

                {/* View Switcher (Cards vs Table) */}
                <div className="border border-[#B7B0A4]/40 flex rounded-none overflow-hidden bg-[#FAF9F6]">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-[#24362D] text-white'
                        : 'text-[#73716B] hover:text-[#20201E]'
                    }`}
                    title="Table View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-[#24362D] text-white'
                        : 'text-[#73716B] hover:text-[#20201E]'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count & Feedback */}
            <div className="flex items-center justify-between text-xs text-[#73716B] px-1">
              <span>
                Showing {filteredHorses.length} of {horses.length} horses
              </span>
              <span className="text-[11px]">
                {horses.filter((h) => h.status === 'Available').length} available for acquisition
              </span>
            </div>

            {/* VIEW MODE: CARDS (Responsive for Mobile, Tablets & Desktops) */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredHorses.map((horse) => {
                  const cover =
                    horse.images?.find((img) => img.is_cover)?.url ||
                    horse.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div
                      key={horse.id}
                      className="bg-white border border-[#B7B0A4]/35 overflow-hidden flex flex-col justify-between group shadow-xs hover:border-[#20201E] transition-all"
                    >
                      <div>
                        {/* Cover Image Container */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          <img
                            src={cover}
                            alt={horse.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <StatusBadge status={horse.status} />
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                                horse.published
                                  ? 'bg-[#24362D] text-white'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {horse.published ? 'Live' : 'Draft'}
                            </span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-4 sm:p-5 space-y-2.5">
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="font-serif text-lg sm:text-xl text-[#20201E] font-medium truncate">
                                {horse.name}
                              </h4>
                              <span className="font-serif text-sm text-[#20201E] font-medium shrink-0">
                                {horse.price
                                  ? `${horse.currency || 'EUR'} ${(horse.price).toLocaleString()}`
                                  : 'Private App'}
                              </span>
                            </div>
                            <p className="text-xs text-[#73716B]">
                              {horse.breed} · {horse.discipline}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#B7B0A4]/20 text-[11px] text-[#73716B]">
                            <div>
                              <span className="block text-[9px] uppercase text-[#73716B]/80">Sex</span>
                              <span className="font-medium text-[#20201E] truncate block">{horse.sex}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-[#73716B]/80">Age</span>
                              <span className="font-medium text-[#20201E] truncate block">{horse.age ? `${horse.age} yrs` : '—'}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase text-[#73716B]/80">Height</span>
                              <span className="font-medium text-[#20201E] truncate block">{horse.height ? horse.height.split(' ')[0] : '—'}</span>
                            </div>
                          </div>

                          {horse.sire && (
                            <p className="text-[11px] text-[#73716B] truncate">
                              <span className="text-[10px] uppercase text-[#A89472] font-semibold">Sire:</span> {horse.sire}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="p-3 bg-[#FAF9F6] border-t border-[#B7B0A4]/25 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onNavigate(`/horses/${horse.slug}`)}
                          className="inline-flex items-center space-x-1 text-xs text-[#73716B] hover:text-[#20201E] py-1.5 px-2 rounded hover:bg-white min-h-[36px]"
                          title="View Public Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Preview</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(horse)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1b2821] transition-colors min-h-[36px] font-medium"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(horse.id)}
                            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VIEW MODE: TABLE (with responsive scroll container) */
              <div className="bg-white border border-[#B7B0A4]/35 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#FAF9F6] border-b border-[#B7B0A4]/25 text-[#73716B] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Horse</th>
                      <th className="py-3 px-4">Breed & Discipline</th>
                      <th className="py-3 px-4">Sex & Age</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B7B0A4]/20 text-[#20201E]">
                    {filteredHorses.map((horse) => {
                      const cover =
                        horse.images?.find((img) => img.is_cover)?.url ||
                        horse.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=150&q=80';

                      return (
                        <tr key={horse.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                          <td className="py-3 px-4 flex items-center space-x-3">
                            <img
                              src={cover}
                              alt=""
                              className="w-12 h-9 object-cover border border-[#B7B0A4]/30 shrink-0"
                            />
                            <div>
                              <span className="font-serif text-sm font-medium block">
                                {horse.name}
                              </span>
                              <span className="text-[10px] text-[#73716B]">
                                {horse.location || 'Normandy Estate'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium block">{horse.breed}</span>
                            <span className="text-[10px] text-[#73716B]">{horse.discipline}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span>{horse.sex}</span>
                            {horse.age && (
                              <span className="text-[10px] text-[#73716B] block">
                                {horse.age} Years
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {horse.price
                              ? `${horse.currency || 'EUR'} ${(horse.price).toLocaleString()}`
                              : 'Private App'}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={horse.status} />
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                horse.published ? 'bg-emerald-500' : 'bg-gray-300'
                              }`}
                            />
                            <span className="text-[11px] text-[#73716B]">
                              {horse.published ? 'Public' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => onNavigate(`/horses/${horse.slug}`)}
                                className="p-1.5 text-[#73716B] hover:text-[#20201E] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                                title="View Public Profile"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStartEdit(horse)}
                                className="p-1.5 text-[#24362D] hover:text-[#18241e] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                                title="Edit Horse"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(horse.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                                title="Delete Horse"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filteredHorses.length === 0 && (
              <div className="p-12 text-center text-xs text-[#73716B] bg-white border border-[#B7B0A4]/35">
                <Compass className="w-8 h-8 text-[#A89472] mx-auto mb-2 opacity-50" />
                <p className="font-serif text-base text-[#20201E]">No horses match the criteria</p>
                <p className="text-xs text-[#73716B] mt-1">Try modifying your search query or status filter.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-[#20201E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 border border-[#B7B0A4]/40 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl text-[#20201E]">Confirm Horse Deletion</h3>
            <p className="text-xs text-[#73716B] leading-relaxed">
              Are you certain you wish to delete this horse profile? This will permanently remove all associated studbook records and gallery links from both the admin and public portal.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] min-h-[38px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 min-h-[38px] font-medium"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
