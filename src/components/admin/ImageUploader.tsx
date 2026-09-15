import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  Star,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useEstate } from '../../lib/estateContext';

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string | null;
  display_order: number;
  is_cover: boolean;
}

interface ImageUploaderProps {
  images: GalleryItem[];
  onChange: (images: GalleryItem[]) => void;
  bucket?: 'horse-images' | 'rescue-images' | 'journal-images' | 'site-images';
  singleMode?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  bucket = 'horse-images',
  singleMode = false,
}) => {
  const { uploadImage } = useEstate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);

    try {
      const newItems: GalleryItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!validTypes.includes(file.type)) {
          setError(`File ${file.name} is not a supported image type (JPG, PNG, WebP).`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} exceeds the 10MB limit.`);
          continue;
        }

        const uploadedUrl = await uploadImage(file, bucket);
        const isCover = images.length === 0 && newItems.length === 0;

        newItems.push({
          id: `img-${Date.now()}-${i}`,
          url: uploadedUrl,
          caption: '',
          display_order: images.length + newItems.length + 1,
          is_cover: isCover,
        });

        if (singleMode) break;
      }

      if (singleMode) {
        onChange(newItems.slice(0, 1));
      } else {
        onChange([...images, ...newItems]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddDirectUrl = () => {
    if (!urlInput.trim()) return;
    const isCover = images.length === 0;
    const newItem: GalleryItem = {
      id: `img-url-${Date.now()}`,
      url: urlInput.trim(),
      caption: '',
      display_order: images.length + 1,
      is_cover: isCover,
    };

    if (singleMode) {
      onChange([newItem]);
    } else {
      onChange([...images, newItem]);
    }
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (images[index]?.is_cover && updated.length > 0) {
      updated[0].is_cover = true;
    }
    onChange(updated);
  };

  const setCover = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_cover: i === index,
    }));
    onChange(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const normalized = reordered.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));
    onChange(normalized);
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed p-4 sm:p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-[#24362D] bg-[#24362D]/5'
            : 'border-[#B7B0A4]/40 hover:border-[#73716B] bg-[#FAF9F6]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={!singleMode}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-white border border-[#B7B0A4]/30 rounded-full text-[#24362D]">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-[#24362D] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs sm:text-sm font-serif text-[#20201E]">
            {isUploading ? 'Uploading photograph...' : 'Tap to select or drag and drop photographs'}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#73716B]">
            JPG, PNG, WebP up to 10MB each {singleMode ? '(Single cover image)' : '(Multiple photos supported)'}
          </p>
        </div>
      </div>

      {/* Direct URL input fallback */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL directly (e.g. Unsplash or CDN)..."
          className="flex-1 px-3 py-2 text-xs bg-white border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D] min-h-[38px]"
        />
        <button
          type="button"
          onClick={handleAddDirectUrl}
          disabled={!urlInput.trim()}
          className="px-4 py-2 text-xs bg-[#24362D] text-white hover:bg-[#1c2a23] transition-colors disabled:opacity-40 min-h-[38px] shrink-0 font-medium uppercase tracking-wider"
        >
          Add URL
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-700 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Gallery List */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs uppercase tracking-wider text-[#73716B] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-semibold text-[#20201E]">
              Uploaded Photos ({images.length})
            </span>
            <span className="text-[10px] text-[#73716B]">
              Star icon sets primary card cover · Reorder with arrows
            </span>
          </div>

          <div className="space-y-2">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="p-3 bg-white border border-[#B7B0A4]/35 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 group transition-all"
              >
                {/* Thumbnail */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="w-16 h-14 bg-gray-100 relative overflow-hidden border border-[#B7B0A4]/20 shrink-0">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {img.is_cover && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#24362D] text-[8px] text-white text-center uppercase tracking-widest py-0.5">
                        Cover
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#73716B] sm:hidden">
                    #{idx + 1} {img.is_cover ? '(Cover Photo)' : ''}
                  </span>
                </div>

                {/* Caption input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={img.caption || ''}
                    onChange={(e) => updateCaption(idx, e.target.value)}
                    placeholder="Editorial caption / photo description..."
                    className="w-full text-xs px-2.5 py-1.5 bg-[#FAF9F6] border border-[#B7B0A4]/30 focus:outline-none focus:border-[#24362D] min-h-[34px]"
                  />
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-end space-x-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#B7B0A4]/20">
                  <button
                    type="button"
                    onClick={() => setCover(idx)}
                    className={`px-2 py-1 rounded text-xs flex items-center space-x-1 min-h-[32px] transition-colors ${
                      img.is_cover
                        ? 'text-[#A89472] bg-[#A89472]/15 font-medium'
                        : 'text-[#73716B] hover:text-[#20201E] hover:bg-gray-100'
                    }`}
                    title={img.is_cover ? 'Primary Cover Image' : 'Set as Cover Image'}
                  >
                    <Star className={`w-3.5 h-3.5 ${img.is_cover ? 'fill-current' : ''}`} />
                    <span className="text-[10px] sm:hidden">Cover</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-[#73716B] hover:text-[#20201E] hover:bg-gray-100 rounded disabled:opacity-20 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === images.length - 1}
                    className="p-1.5 text-[#73716B] hover:text-[#20201E] hover:bg-gray-100 rounded disabled:opacity-20 min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer ml-1"
                    title="Remove Photograph"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
