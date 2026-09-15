import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  LayoutGrid,
  List as ListIcon,
  Download,
  Save,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { JournalPost } from '../../types/database';

interface AdminJournalPageProps {
  initialAction?: string | null;
  onNavigate: (path: string) => void;
}

export const AdminJournalPage: React.FC<AdminJournalPageProps> = ({ initialAction, onNavigate }) => {
  const { journal, saveJournalPost, deleteJournalPost } = useEstate();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingPost, setEditingPost] = useState<JournalPost | null>(null);
  const [isCreating, setIsCreating] = useState(initialAction === 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (initialAction === 'new') {
      handleStartCreate();
    }
  }, [initialAction]);

  const handleStartCreate = () => {
    setEditingPost({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Breeding',
      featured_image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
      author: 'Henri de Montrose',
      published: true,
      published_at: new Date().toISOString(),
      seo_title: '',
      seo_description: '',
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  const handleStartEdit = (post: JournalPost) => {
    setEditingPost({ ...post });
    setIsCreating(false);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPost || !editingPost.title.trim()) return;

    setIsSaving(true);
    setSavedSuccess(false);
    setSaveError(null);
    try {
      await saveJournalPost(editingPost);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingPost(null);
        setIsCreating(false);
      }, 700);
    } catch (err: any) {
      console.error('Error saving journal post:', err);
      setSaveError(err.message || 'Failed to save post to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteJournalPost(id);
    setConfirmDeleteId(null);
    if (editingPost?.id === id) {
      setEditingPost(null);
    }
  };

  const categories = ['all', 'Breeding', 'Training', 'Rescue', 'Estate Life', 'Equestrian Heritage'];

  const filteredPosts = journal.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['Title', 'Category', 'Author', 'Published Date', 'Published'];
    const rows = filteredPosts.map((p) => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.author}"`,
      `"${p.published_at}"`,
      p.published ? 'Yes' : 'No',
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `montrose-journal-articles-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24">
      {!editingPost ? (
        <AdminHeader
          category="Editorial & Thought Leadership"
          title="Estate Journal"
          subtitle="Publish breeding philosophies, classical equestrian insights, and dispatches from the Normandy estate."
          actionLabel="Compose Article"
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
        /* Sticky Top Action Bar when composing */
        <div className="sticky top-0 z-20 bg-white border-b border-[#B7B0A4]/30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsCreating(false);
              }}
              className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] py-1.5 px-2.5 rounded hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-xl text-[#20201E] truncate">
                {isCreating ? 'Compose New Article' : `Editing: ${editingPost.title}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setIsCreating(false);
              }}
              className="px-3.5 py-2 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] border border-[#B7B0A4]/35 hover:bg-[#FAF9F6] min-h-[38px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving || !editingPost.title.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[38px] font-medium shadow-xs"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        {editingPost ? (
          <div className="bg-white border border-[#B7B0A4]/35 p-4 sm:p-8 lg:p-10 space-y-8 shadow-xs animate-in fade-in duration-150">
            {saveError && (
              <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-950">Cloud Database Sync Alert</p>
                  <p className="text-rose-800">{saveError}</p>
                  <p className="text-[11px] text-rose-700 pt-1">
                    To fix missing tables or storage buckets, open Supabase SQL Editor and execute the consolidated script in <code className="bg-rose-100 px-1 py-0.5 rounded">/supabase/FULL_SETUP.sql</code>.
                  </p>
                </div>
              </div>
            )}
            <form onSubmit={handleSave} className="space-y-8">
              {/* Primary Article Meta */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  1. Article Metadata & Attribution
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. Classical Dressage Principles in Modern Breeding"
                    className="w-full px-3 py-2 text-sm sm:text-base font-serif bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Category *
                    </label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    >
                      <option value="Breeding">Breeding Philosophy</option>
                      <option value="Training">Classical Training</option>
                      <option value="Rescue">Sanctuary Dispatches</option>
                      <option value="Estate Life">Estate Chronicles</option>
                      <option value="Equestrian Heritage">Heritage & Bloodlines</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Author Byline
                    </label>
                    <input
                      type="text"
                      value={editingPost.author}
                      onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                      placeholder="e.g. Henri de Montrose"
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      value={editingPost.published_at?.split('T')[0] || ''}
                      onChange={(e) =>
                        setEditingPost({
                          ...editingPost,
                          published_at: new Date(e.target.value).toISOString(),
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                    <input
                      type="checkbox"
                      checked={editingPost.published}
                      onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                      className="w-4 h-4 accent-[#24362D]"
                    />
                    <span className="font-medium">Published Live to Public Journal</span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-[#20201E]">
                    <input
                      type="checkbox"
                      checked={editingPost.featured}
                      onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#24362D]"
                    />
                    <span className="font-medium">Pin as Featured Lead Story</span>
                  </label>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  2. Hero Header Photograph
                </h3>
                <ImageUploader
                  singleMode
                  images={
                    editingPost.featured_image
                      ? [
                          {
                            id: 'lead-cover',
                            url: editingPost.featured_image,
                            caption: 'Article Header',
                            display_order: 1,
                            is_cover: true,
                          },
                        ]
                      : []
                  }
                  onChange={(imgs) => {
                    setEditingPost({
                      ...editingPost,
                      featured_image:
                        imgs[0]?.url ||
                        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
                    });
                  }}
                  bucket="journal-images"
                />
              </div>

              {/* Editorial Copy */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  3. Manuscript & Editorial Body
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                    Standfirst / Excerpt (Lead summary for search & cards)
                  </label>
                  <textarea
                    rows={2}
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    placeholder="Short summary paragraph introducing the article..."
                    className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
                  />
                </div>

                <RichTextEditor
                  label="Full Article Manuscript"
                  value={editingPost.content}
                  onChange={(val) => setEditingPost({ ...editingPost, content: val })}
                  rows={14}
                  placeholder="Write in markdown or plain paragraphs. Supports headings, bold, blockquotes, and lists..."
                />
              </div>

              {/* SEO & Discoverability */}
              <div className="space-y-4 pt-4 border-t border-[#B7B0A4]/25">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#A89472] font-semibold border-b border-[#B7B0A4]/20 pb-2">
                  4. Search Engine Optimization & Social Sharing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                        SEO Meta Title
                      </label>
                      <span className="text-[10px] text-[#73716B]">
                        {(editingPost.seo_title || '').length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingPost.seo_title || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, seo_title: e.target.value })}
                      placeholder={editingPost.title || 'Page title for Google'}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">
                        SEO Meta Description
                      </label>
                      <span className="text-[10px] text-[#73716B]">
                        {(editingPost.seo_description || '').length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingPost.seo_description || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, seo_description: e.target.value })}
                      placeholder="Concise summary for search engines (up to 160 characters)"
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#B7B0A4]/30">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E] text-center min-h-[42px]"
                >
                  Cancel & Exit
                </button>

                <div className="flex items-center space-x-3">
                  {!isCreating && editingPost.id && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(editingPost.id)}
                      className="px-4 py-2.5 text-xs uppercase tracking-wider text-rose-600 hover:bg-rose-50 border border-rose-200 min-h-[42px]"
                    >
                      Delete Article
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2a23] transition-colors disabled:opacity-50 min-h-[42px] font-medium shadow-xs text-center"
                  >
                    {isSaving ? 'Publishing...' : 'Save & Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Cards vs Table View of Articles */
          <div className="space-y-4">
            <div className="bg-white p-3.5 sm:p-4 border border-[#B7B0A4]/35 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#73716B] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search articles by title or topic..."
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
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? `All Categories (${journal.length})` : cat}
                    </option>
                  ))}
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

            {/* Articles Cards View */}
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-[#B7B0A4]/35 overflow-hidden flex flex-col justify-between group shadow-xs hover:border-[#20201E] transition-all"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 bg-[#FAF9F6]/95 border border-[#B7B0A4]/40 text-[9px] uppercase tracking-wider text-[#24362D] font-semibold">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                              post.published ? 'bg-[#24362D] text-white' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {post.published ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-2">
                        <h4 className="font-serif text-lg sm:text-xl text-[#20201E] font-medium line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs text-[#73716B] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="pt-2 text-[11px] text-[#73716B] flex items-center justify-between border-t border-[#B7B0A4]/20">
                          <span>By {post.author}</span>
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF9F6] border-t border-[#B7B0A4]/25 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onNavigate(`/journal/${post.slug}`)}
                        className="inline-flex items-center space-x-1 text-xs text-[#73716B] hover:text-[#20201E] py-1.5 px-2 rounded hover:bg-white min-h-[36px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Preview</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1b2821] transition-colors min-h-[36px] font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Articles Table View */
              <div className="bg-white border border-[#B7B0A4]/35 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#FAF9F6] border-b border-[#B7B0A4]/25 text-[#73716B] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Article Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Published Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B7B0A4]/20 text-[#20201E]">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-12 h-9 object-cover border border-[#B7B0A4]/30 shrink-0"
                          />
                          <div className="max-w-md">
                            <span className="font-serif text-sm font-medium block truncate">
                              {post.title}
                            </span>
                            <span className="text-[10px] text-[#73716B] truncate block">
                              {post.excerpt}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-[#FAF9F6] border border-[#B7B0A4]/30 text-[10px] uppercase tracking-wider text-[#A89472]">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{post.author}</td>
                        <td className="py-3 px-4 text-[11px] text-[#73716B]">
                          {new Date(post.published_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                              post.published ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          />
                          <span className="text-[11px] text-[#73716B]">
                            {post.published ? 'Live' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onNavigate(`/journal/${post.slug}`)}
                              className="p-1.5 text-[#73716B] hover:text-[#20201E] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="View Live Article"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(post)}
                              className="p-1.5 text-[#24362D] hover:text-[#18241e] rounded hover:bg-gray-100 min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(post.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
            <h3 className="font-serif text-xl text-[#20201E]">Confirm Article Deletion</h3>
            <p className="text-xs text-[#73716B] leading-relaxed">
              Are you sure you want to remove this journal article from the publication index?
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
