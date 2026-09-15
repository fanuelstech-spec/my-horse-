import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: Array<{ url: string; caption?: string | null }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#20201E]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-[#FAF9F6] w-full max-w-6xl mx-auto z-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[#B7B0A4]">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 text-[#B7B0A4] hover:text-white transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Image View */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 max-w-6xl mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-[#20201E]/60 text-white hover:bg-[#20201E] transition-colors border border-[#73716B]/30"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="max-h-[80vh] flex flex-col items-center">
          <img
            src={currentImg.url}
            alt={currentImg.caption || 'Estate Horse Photograph'}
            className="max-h-[72vh] max-w-full object-contain shadow-2xl border border-[#73716B]/20"
          />
          {currentImg.caption && (
            <p className="mt-3 text-sm text-[#B7B0A4] font-serif italic text-center max-w-xl">
              {currentImg.caption}
            </p>
          )}
        </div>

        {images.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-[#20201E]/60 text-white hover:bg-[#20201E] transition-colors border border-[#73716B]/30"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom hint */}
      <div className="text-center text-[11px] text-[#73716B] uppercase tracking-widest pb-2">
        Use arrow keys or click to navigate · Press ESC to close
      </div>
    </div>
  );
};
