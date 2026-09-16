import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Quote } from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

interface AdminTestimonialsPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminTestimonialsPage: React.FC<AdminTestimonialsPageProps> = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useEstate();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    buyer_name: '',
    horse_name: '',
    location: '',
    testimonial: '',
    image_url: '',
    published: true,
  });

  const resetForm = () => {
    setFormData({
      buyer_name: '',
      horse_name: '',
      location: '',
      testimonial: '',
      image_url: '',
      published: true,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleEdit = (t: any) => {
    setFormData({
      buyer_name: t.buyer_name,
      horse_name: t.horse_name,
      location: t.location || '',
      testimonial: t.testimonial,
      image_url: t.image_url || '',
      published: t.published,
    });
    setEditingId(t.id);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await addTestimonial(formData);
      }
      resetForm();
    } catch (e) {
      console.error(e);
      alert('Failed to save testimonial');
    }
  };

  if (isCreating || editingId) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#20201E]">
            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
          </h2>
          <button
            onClick={resetForm}
            className="text-xs uppercase tracking-wider text-[#73716B] hover:text-[#20201E]"
          >
            Cancel
          </button>
        </div>
        
        <div className="bg-white border border-[#B7B0A4]/35 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Buyer Name *</label>
              <input
                type="text"
                value={formData.buyer_name}
                onChange={(e) => setFormData(f => ({ ...f, buyer_name: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Horse Name *</label>
              <input
                type="text"
                value={formData.horse_name}
                onChange={(e) => setFormData(f => ({ ...f, horse_name: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(f => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData(f => ({ ...f, image_url: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-[#73716B] font-medium">Testimonial Text *</label>
            <textarea
              rows={5}
              value={formData.testimonial}
              onChange={(e) => setFormData(f => ({ ...f, testimonial: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#B7B0A4]/40 focus:outline-none focus:border-[#24362D]"
            />
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(f => ({ ...f, published: e.target.checked }))}
              className="accent-[#24362D]"
            />
            <span className="text-sm font-medium text-[#20201E]">Published to Website</span>
          </label>
          
          <div className="pt-4 border-t border-[#B7B0A4]/20 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1a2820] transition-colors"
            >
              Save Testimonial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#20201E]">Success Stories</h1>
          <p className="text-sm text-[#73716B] mt-1">Manage client testimonials and successful matches.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1a2820] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border border-[#B7B0A4]/35 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {t.image_url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#B7B0A4]/30">
                    <img src={t.image_url} alt={t.buyer_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full shrink-0 border border-[#B7B0A4]/30 bg-[#FAF9F6] flex items-center justify-center">
                    <Quote className="w-4 h-4 text-[#A89472]" />
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-lg text-[#20201E]">{t.buyer_name}</h4>
                  <p className="text-[10px] uppercase tracking-wider text-[#73716B]">
                    {t.horse_name} {t.location ? `· ${t.location}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                  t.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {t.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-[#73716B] italic line-clamp-3 mb-6 flex-1">
              "{t.testimonial}"
            </p>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-[#B7B0A4]/20">
              <button
                onClick={() => handleEdit(t)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#20201E] bg-[#FAF9F6] border border-[#B7B0A4]/40 hover:bg-white"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this testimonial?')) {
                    deleteTestimonial(t.id);
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-[#B7B0A4] text-[#73716B]">
            No testimonials recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
