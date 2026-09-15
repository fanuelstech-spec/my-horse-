import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Heart,
  LayoutGrid,
  List as ListIcon,
  Download,
  Save,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatusBadge } from '../../components/public/StatusBadge';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { Rescue, RescueStatus } from '../../types/database';

interface AdminRescuePageProps {
  initialAction?: string | null;
  onNavigate: (path: string) => void;
}

export const AdminRescuePage: React.FC<AdminRescuePageProps> = ({ initialAction, onNavigate }) => {
  const { rescues, saveRescue, deleteRescue } = useEstate();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingRescue, setEditingRescue] = useState<Rescue | null>(null);
  const [isCreating, setIsCreating] = useState(initialAction === 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (initialAction === 'new') {
      handleStartCreate();
    }
  }, [initialAction]);

  const handleStartCreate = () => {
    setEditingRescue({
      id: '',
      name: '',
      slug: '',
      rescue_date: new Date().toISOString().split('T')[0],
      status: 'In Rehabilitation',
      short_description: '',
      story: '',
      rehabilitation: '',
      current_status: '',
      location: 'Montrose Sanctuary, Normandy',
      featured: false,
      published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
      story_sections: [],
    });
    setIsCreating(true);
  };

  const handleStartEdit = (rescue: Rescue) => {
    setEditingRescue({ ...rescue });
    setIsCreating(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingRescue || !editingRescue.name.trim()) return;

    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await saveRescue(editingRescue);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingRescue(null);
        setIsCreating(false);
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRescue(id);
    setConfirmDeleteId(null);
    if (editingRescue?.id === id) {
      setEditingRescue(null);
    }
  };

  // Add / edit story milestone sections
  const addStoryMilestone = () => {
    if (!editingRescue) return;
    const currentSections = editingRescue.story_sections || [];
    const newSection = {
      id: `milestone-${Date.now()}`,
      rescue_id: editingRescue.id,
      title: 'Health & Recovery Update',
      date: new Date().toISOString().split('T')[0],
      content: '',
      image_url: null,
      order: currentSections.length + 1,
    };
    setEditingRescue({
      ...editingRescue,
      story_sections: [...currentSections, newSection],
    });
  };

  const updateStoryMilestone = (index: number, field: string, val: any) => {
    if (!editingRescue) return;
    const updated = [...(editingRescue.story_sections || [])];
    updated[index] = { ...updated[index], [field]: val };
    setEditingRescue({ ...editingRescue, story_sections: updated });
  };

  const removeStoryMilestone = (index: number) => {
    if (!editingRescue) return;
    const updated = (editingRescue.story_sections || []).filter((_, i) => i !== index);
    setEditingRescue({ ...editingRescue, story_sections: updated });
  };

  const filteredRescues = rescues.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.short_description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Status', 'Rescue Date', 'Location', 'Published'];
    const rows = filteredRescues.map((r) => [
      `"${r.name}"`,
      `"${r.status}"`,
      `"${r.rescue_date}"`,
      `"${r.location}"`,
      r.published ? 'Yes' : 'No',
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `montrose-rescues-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {!editingRescue ? (
        <AdminHeader
          category="Philanthropy & Sanctuary"
          title="Rescue & Rehabilitation Registry"
          subtitle="Document rehabilitation chronicles, veterinary milestones, and lifetime sanctuary commitments."
          actionLabel="Record New Rescue"
          onAction={handleStartCreate}
        >
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#B7B0A4]/40 text-[#20201E] text-xs uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors min-h-[38px] cursor-pointer"
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
                setEditingRescue(null);
                setIsCreating(false);
              }}
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] py-1.5 px-2.5 rounded hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-xl text-[#20201E] truncate">
                {isCreating ? 'Record New Rescue Story' : `Editing: ${editingRescue.name}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setEditingRescue(null);
                setIsCreating(false);
              }}
              className="px-3.5 py-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] border border-[#B7B0A4]/35 hover:bg-[#FAF9F6] min-h-[38px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || !editingRescue.name.trim()}
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
        {editingRescue ? (
          <div className="bg-white border border-[#B7B0A4]/35 p-4 sm:p-8 lg:p-10 space-y-8 shadow-xs animate-in fade-in duration-150">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Primary Identity */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  1. Identification & Arrival Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Horse Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingRescue.name}
                      onChange={(e) => setEditingRescue({ ...editingRescue, name: e.target.value })}
                      placeholder="e.g. Bella de Montrose"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Arrival / Rescue Date
                    </label>
                    <input
                      type="date"
                      value={editingRescue.rescue_date || ''}
                      onChange={(e) => setEditingRescue({ ...editingRescue, rescue_date: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Sanctuary Status *
                    </label>
                    <select
                      value={editingRescue.status}
                      onChange={(e) => setEditingRescue({ ...editingRescue, status: e.target.value as RescueStatus })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    >
                      <option value="In Rehabilitation">In Rehabilitation</option>
                      <option value="Sanctuary">Permanent Sanctuary</option>
                      <option value="Adopted">Adopted / Re-homed</option>
                      <option value="In Memoriam">In Memoriam</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Sanctuary Paddock / Barn Location
                    </label>
                    <input
                      type="text"
                      value={editingRescue.location || ''}
                      onChange={(e) => setEditingRescue({ ...editingRescue, location: e.target.value })}
                      placeholder="e.g. South Pastures, Montrose Sanctuary"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-5">
                    <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                      <input
                        type="checkbox"
                        checked={editingRescue.published}
                        onChange={(e) => setEditingRescue({ ...editingRescue, published: e.target.checked })}
                        className="w-4 h-4 accent-[#24362D]"
                      />
                      <span className="font-medium">Published on Public Website</span>
                    </label>

                    <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                      <input
                        type="checkbox"
                        checked={editingRescue.featured}
                        onChange={(e) => setEditingRescue({ ...editingRescue, featured: e.target.checked })}
                        className="w-4 h-4 accent-[#24362D]"
                      />
                      <span className="font-medium">Spotlight on Homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Photographic Gallery */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  2. Photographic Gallery & Visual Timeline
                </h3>
                <ImageUploader
                  images={(editingRescue.images || []).map((img, i) => ({
                    id: img.id || `rescue-img-${i}`,
                    url: img.url,
                    caption: img.caption,
                    display_order: img.display_order,
                    is_cover: img.is_cover,
                  }))}
                  onChange={(imgs) => {
                    setEditingRescue({
                      ...editingRescue,
                      images: imgs.map((img, i) => ({
                        id: img.id,
                        rescue_id: editingRescue.id,
                        url: img.url,
                        caption: img.caption || null,
                        display_order: i + 1,
                        is_cover: img.is_cover,
                        created_at: new Date().toISOString(),
                      })),
                    });
                  }}
                  bucket="rescue-images"
                />
              </div>

              {/* Story & Rehabilitation Narrative */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  3. Rehabilitation Chronicle & Current Wellness
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Short Synopsis (Displays on cards & search previews)
                  </label>
                  <textarea
                    rows={2}
                    value={editingRescue.short_description || ''}
                    onChange={(e) => setEditingRescue({ ...editingRescue, short_description: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the rescue case..."
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>

                <RichTextEditor
                  label="Full Rescue Narrative & Background"
                  value={editingRescue.story}
                  onChange={(val) => setEditingRescue({ ...editingRescue, story: val })}
                  rows={8}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Veterinary Treatment & Physical Rehabilitation
                    </label>
                    <textarea
                      rows={4}
                      value={editingRescue.rehabilitation || ''}
                      onChange={(e) => setEditingRescue({ ...editingRescue, rehabilitation: e.target.value })}
                      placeholder="e.g. Orthopedic therapy, nutritional recovery regimen..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Current Daily Life & Sanctuary Status
                    </label>
                    <textarea
                      rows={4}
                      value={editingRescue.current_status || ''}
                      onChange={(e) => setEditingRescue({ ...editingRescue, current_status: e.target.value })}
                      placeholder="e.g. Thriving in the herd, sound at walk and trot..."
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                    />
                  </div>
                </div>
              </div>

              {/* Progress Milestones Builder */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#B7B0A4]/20 pb-2">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold">
                      4. Dated Progress Milestones ({editingRescue.story_sections?.length || 0})
                    </h3>
                    <p className="text-xs text-[#73716B]">Chronological updates shown on public story page</p>
                  </div>
                  <button
                    type="button"
                    onClick={addStoryMilestone}
                    className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-[#24362D] text-white hover:bg-[#1b2821] transition-colors rounded-none font-medium min-h-[34px] self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingRescue.story_sections || []).map((milestone, idx) => (
                    <div
                      key={milestone.id || idx}
                      className="p-4 bg-[#FAF9F6] border border-[#B7B0A4]/35 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 bg-[#A89472] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-serif text-[#20201E] font-medium">
                            Milestone #{idx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStoryMilestone(idx)}
                          className="text-xs text-rose-600 hover:text-rose-800 self-end sm:self-auto"
                        >
                          Remove Milestone
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                            Milestone Title
                          </label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateStoryMilestone(idx, 'title', e.target.value)}
                            placeholder="e.g. First Turnout in Pasture"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                            Date
                          </label>
                          <input
                            type="date"
                            value={milestone.date || ''}
                            onChange={(e) => updateStoryMilestone(idx, 'date', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Photo URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={milestone.image_url || ''}
                          onChange={(e) => updateStoryMilestone(idx, 'image_url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[#73716B]">
                          Description of Progress
                        </label>
                        <textarea
                          rows={2}
                          value={milestone.content}
                          onChange={(e) => updateStoryMilestone(idx, 'content', e.target.value)}
                          placeholder="Document observations, weight gain, mobility..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#B7B0A4]/30">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRescue(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] text-center min-h-[42px]"
                >
                  Cancel & Exit
                </button>

                <div className="flex items-center space-x-3">
                  {!isCreating && editingRescue.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(editingRescue.id)}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider text-rose-600 hover:bg-rose-50 border border-rose-200 min-h-[42px]"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[42px] font-medium shadow-xs text-center"
                  >
                    {isSaving ? 'Saving Record...' : 'Save Sanctuary Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Cards vs Table View of Rescues */
          <div className="space-y-4">
            <div className="bg-white p-3.5 sm:p-4 border border-[#B7B0A4]/35 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search sanctuary stories..."
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
                  <option value="all">All Sanctuary Statuses ({rescues.length})</option>
                  <option value="In Rehabilitation">In Rehabilitation</option>
                  <option value="Sanctuary">Permanent Sanctuary</option>
                  <option value="Adopted">Adopted</option>
                  <option value="In Memoriam">In Memoriam</option>
                </select>

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

            {/* Rescues Cards View */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredRescues.map((rescue) => {
                  const cover =
                    rescue.images?.find((img) => img.is_cover)?.url ||
                    rescue.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div
                      key={rescue.id}
                      className="bg-white border border-[#B7B0A4]/35 overflow-hidden flex flex-col justify-between group shadow-xs hover:border-[#20201E] transition-all"
                    >
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                          <img
                            src={cover}
                            alt={rescue.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <StatusBadge status={rescue.status} />
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                                rescue.published ? 'bg-[#24362D] text-white' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {rescue.published ? 'Live' : 'Draft'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 space-y-2">
                          <h4 className="font-serif text-lg sm:text-xl text-[#20201E] font-medium">
                            {rescue.name}
                          </h4>
                          <p className="text-xs text-[#73716B] line-clamp-2">
                            {rescue.short_description || rescue.story}
                          </p>
                          <div className="pt-2 text-[11px] text-[#73716B] flex items-center justify-between">
                            <span>Arrival: {rescue.rescue_date}</span>
                            <span>{rescue.story_sections?.length || 0} Milestones</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAF9F6] border-t border-[#B7B0A4]/25 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onNavigate(`/rescue/${rescue.slug}`)}
                          className="inline-flex items-center space-x-1 text-xs text-[#73716B] hover:text-[#20201E] py-1.5 px-2 rounded hover:bg-white min-h-[36px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Preview</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(rescue)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1b2821] transition-colors min-h-[36px] font-medium"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(rescue.id)}
                            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
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
              /* Rescues Table View */
              <div className="bg-white border border-[#B7B0A4]/35 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#FAF9F6] border-b border-[#B7B0A4]/25 text-[#73716B] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Rescue Name</th>
                      <th className="py-3 px-4">Arrival Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B7B0A4]/20 text-[#20201E]">
                    {filteredRescues.map((rescue) => {
                      const cover =
                        rescue.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=150&q=80';

                      return (
                        <tr key={rescue.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                          <td className="py-3 px-4 flex items-center space-x-3">
                            <img src={cover} alt="" className="w-12 h-9 object-cover border border-[#B7B0A4]/30 shrink-0" />
                            <div>
                              <span className="font-serif text-sm font-medium block">{rescue.name}</span>
                              <span className="text-[10px] text-[#73716B] line-clamp-1 max-w-xs">
                                {rescue.short_description}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#73716B]">{rescue.rescue_date}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={rescue.status} />
                          </td>
                          <td className="py-3 px-4 text-[11px] text-[#73716B]">{rescue.location}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                rescue.published ? 'bg-emerald-500' : 'bg-gray-300'
                              }`}
                            />
                            <span className="text-[11px] text-[#73716B]">
                              {rescue.published ? 'Public' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => onNavigate(`/rescue/${rescue.slug}`)}
                                className="p-1.5 text-[#73716B] hover:text-[#20201E] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                title="View Public Story"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleStartEdit(rescue)}
                                className="p-1.5 text-[#24362D] hover:text-[#18241e] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                title="Edit Story"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(rescue.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
                                title="Delete Story"
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
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-[#20201E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 border border-[#B7B0A4]/40 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl text-[#20201E]">Confirm Rescue Deletion</h3>
            <p className="text-xs text-[#73716B] leading-relaxed">
              Are you sure you want to delete this sanctuary record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#73716B] min-h-[38px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 text-xs uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 min-h-[38px] font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
