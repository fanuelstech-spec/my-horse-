import React, { useState } from 'react';
import { ArrowLeft, Heart, Shield, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { Rescue } from '../types/database';
import { StatusBadge } from '../components/public/StatusBadge';
import { Lightbox } from '../components/public/Lightbox';

interface RescueDetailPageProps {
  slug?: string;
  rescue?: Rescue;
  onNavigate: (path: string) => void;
}

export const RescueDetailPage: React.FC<RescueDetailPageProps> = ({ slug, rescue: propRescue, onNavigate }) => {
  const { getRescueBySlug, rescues } = useEstate();
  const rescue =
    propRescue ||
    (slug ? getRescueBySlug(slug) : undefined) ||
    (slug
      ? rescues.find(
          (r) =>
            r.slug === slug ||
            r.id === slug ||
            r.slug?.toLowerCase() === slug.toLowerCase() ||
            r.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        )
      : undefined);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!rescue) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#20201E]">Rescue Story Not Found</h1>
        <p className="text-sm text-[#73716B]">
          The sanctuary story you requested could not be located.
        </p>
        <button
          onClick={() => onNavigate('/rescue')}
          className="mt-4 px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider"
        >
          Return to Sanctuary Stories
        </button>
      </div>
    );
  }

  const images = rescue.images && rescue.images.length > 0 ? rescue.images : [];
  const coverImage =
    images[0]?.url ||
    '/images/rescue.jpg';

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const isLookingForHome = rescue.status === 'Looking for a Home';

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        <button
          onClick={() => onNavigate('/rescue')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-[#73716B] hover:text-[#20201E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary Overview</span>
        </button>
      </div>

      {/* Top Header & Large Photo */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
              The Journey of
            </span>
            <StatusBadge status={rescue.status} />
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-tight">
            {rescue.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#73716B] uppercase tracking-wider">
            Rescued {rescue.rescue_date} · Current Residence: {rescue.location || 'Sterling Sanctuary'}
          </p>
        </div>

        {/* Hero Photo */}
        <div
          onClick={() => openLightboxAt(0)}
          className="aspect-[16/9] w-full overflow-hidden bg-white border border-[#B7B0A4]/35 shadow-sm cursor-pointer relative group"
        >
          <img
            src={coverImage}
            alt={rescue.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-[#20201E]/80 text-white text-xs uppercase tracking-widest px-4 py-2">
              View Full Photograph
            </span>
          </div>
        </div>
      </section>

      {/* The Story & Timeline */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Story Narrative */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-[#20201E] font-normal border-b border-[#B7B0A4]/25 pb-3">
                The Rescue Narrative
              </h2>
              <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4 whitespace-pre-line">
                {rescue.story}
              </div>
            </div>

            {/* Rehabilitation Protocol */}
            {rescue.rehabilitation && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-[#20201E] font-normal border-b border-[#B7B0A4]/25 pb-3">
                  Rehabilitation & Clinical Restoration
                </h3>
                <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4 whitespace-pre-line">
                  {rescue.rehabilitation}
                </div>
              </div>
            )}

            {/* Story Sections / Timeline if present */}
            {rescue.story_sections && rescue.story_sections.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="font-serif text-2xl text-[#20201E] font-normal border-b border-[#B7B0A4]/25 pb-3">
                  Timeline of Progress
                </h3>
                <div className="space-y-6">
                  {rescue.story_sections.map((section, idx) => (
                    <div key={section.id || idx} className="p-6 bg-white border border-[#B7B0A4]/35 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-xl text-[#20201E]">{section.title}</h4>
                        {(section.stage_date || section.date_label || section.date) && (
                          <span className="text-xs font-mono text-[#A89472]">
                            {section.stage_date || section.date_label || section.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#73716B] leading-relaxed font-light">
                        {section.content}
                      </p>
                      {section.image_url && (
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100 mt-3">
                          <img
                            src={section.image_url}
                            alt={section.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Status Narrative */}
            {rescue.current_status && (
              <div className="space-y-3 bg-[#FAF9F6] p-6 border border-[#B7B0A4]/30">
                <h3 className="font-serif text-xl text-[#20201E] font-normal">
                  Present Day Condition
                </h3>
                <p className="text-xs sm:text-sm text-[#73716B] leading-relaxed font-light whitespace-pre-line">
                  {rescue.current_status}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Status & Home Inquiries */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#B7B0A4]/35 p-6 space-y-4">
              <div className="flex items-center space-x-2 text-[#24362D]">
                <Shield className="w-4 h-4 text-[#A89472]" />
                <h4 className="font-serif text-lg text-[#20201E]">Sanctuary Commitment</h4>
              </div>
              <p className="text-xs text-[#73716B] leading-relaxed font-light">
                {isLookingForHome
                  ? `${rescue.name} has completed full veterinary recovery and is seeking an approved companion or light-activity home with experienced equestrians.`
                  : `${rescue.name} has lifetime sanctuary status at Sterling. They will spend all remaining years in peaceful Normandy herd pastures.`}
              </p>

              <div className="pt-2">
                <button
                  onClick={() =>
                    onNavigate(
                      `/contact?subject=${encodeURIComponent(
                        isLookingForHome
                          ? `Adoption Enquiry: ${rescue.name}`
                          : `Sanctuary Enquiry: ${rescue.name}`
                      )}`
                    )
                  }
                  className="w-full py-3 bg-[#24362D] text-white text-xs uppercase tracking-[0.18em] hover:bg-[#1a2820] transition-colors"
                >
                  {isLookingForHome ? 'Inquire About Adoption' : 'Contact About This Story'}
                </button>
              </div>
            </div>

            {/* Additional gallery thumbnails */}
            {images.length > 1 && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-[#73716B] block">
                  Additional Photographs
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img.id || i}
                      onClick={() => openLightboxAt(i)}
                      className="aspect-[4/3] overflow-hidden bg-white border border-[#B7B0A4]/35 hover:border-[#20201E] transition-colors"
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
};
