import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Award, Shield, HeartHandshake, Eye } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { Horse } from '../types/database';
import { StatusBadge } from '../components/public/StatusBadge';
import { PedigreeTree } from '../components/public/PedigreeTree';
import { Lightbox } from '../components/public/Lightbox';

interface HorseDetailPageProps {
  slug?: string;
  horse?: Horse;
  onNavigate: (path: string) => void;
}

export const HorseDetailPage: React.FC<HorseDetailPageProps> = ({ slug, horse: propHorse, onNavigate }) => {
  const { getHorseBySlug, horses } = useEstate();
  
  // Resolve the horse: either provided directly via prop, or looked up via slug or ID
  const horse =
    propHorse ||
    (slug ? getHorseBySlug(slug) : undefined) ||
    (slug
      ? horses.find(
          (h) =>
            h.slug === slug ||
            h.id === slug ||
            h.slug?.toLowerCase() === slug.toLowerCase() ||
            h.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
        )
      : undefined);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!horse) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#20201E]">Horse Profile Not Found</h1>
        <p className="text-sm text-[#73716B]">
          The horse profile you are seeking is either no longer listed or has been archived.
        </p>
        <button
          onClick={() => onNavigate('/horses')}
          className="mt-4 px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider"
        >
          Return to Available Horses
        </button>
      </div>
    );
  }

  const images = horse.images && horse.images.length > 0 ? horse.images : [];
  const coverImage =
    images.find((img) => img.is_cover)?.url ||
    images[0]?.url ||
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1800&q=85';

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleEnquire = () => {
    onNavigate(`/contact?horse=${encodeURIComponent(horse.name)}&id=${horse.id}`);
  };

  // Structured specification entries that only show if present
  const specs = [
    { label: 'Breed', value: horse.breed },
    { label: 'Sex', value: horse.sex },
    { label: 'Age', value: horse.age ? `${horse.age} Years` : null },
    { label: 'Height', value: horse.height },
    { label: 'Color', value: horse.color },
    { label: 'Discipline', value: horse.discipline },
    { label: 'Training Level', value: horse.training_level },
    { label: 'Date of Birth', value: horse.date_of_birth },
    { label: 'Registration No.', value: horse.registration_number },
    { label: 'Sire', value: horse.sire },
    { label: 'Dam', value: horse.dam },
    { label: 'Location', value: horse.location },
    {
      label: 'Investment Price',
      value: horse.price ? `${horse.currency || 'EUR'} ${(horse.price).toLocaleString()}` : 'Price on Private Application',
    },
    { label: 'Current Status', value: horse.status },
  ].filter((item) => Boolean(item.value));

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-8">
        <button
          onClick={() => onNavigate('/horses')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.18em] text-[#73716B] hover:text-[#20201E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Horses</span>
        </button>
      </div>

      {/* Top Section: Hero Image & Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Hero Image */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="aspect-[4/3] w-full overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/35 shadow-sm relative group cursor-pointer"
              onClick={() => openLightboxAt(0)}
            >
              <img
                src={coverImage}
                alt={horse.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-[#20201E]/80 text-white text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Photograph</span>
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <StatusBadge status={horse.status} />
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 pt-2">
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => openLightboxAt(i)}
                    className="aspect-[4/3] overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/40 hover:border-[#20201E] transition-all relative"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || horse.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Name, Subtitle, Key Specification Table */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
                Montrose Studbook Record
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#20201E] font-normal tracking-tight mt-1">
                {horse.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#73716B] tracking-wider uppercase font-sans mt-2">
                {horse.breed} · {horse.sex} {horse.age ? `· ${horse.age} Years` : ''} · {horse.discipline}
              </p>
            </div>

            {/* Short Synopsis */}
            <p className="text-sm text-[#20201E] font-serif italic text-lg leading-relaxed border-l-2 border-[#A89472] pl-4">
              "{horse.short_description}"
            </p>

            {/* Clean Specifications Table */}
            <div className="bg-white border border-[#B7B0A4]/35 divide-y divide-[#B7B0A4]/20 text-xs">
              {specs.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 px-4">
                  <span className="text-[#73716B] uppercase tracking-wider text-[10px]">
                    {item.label}
                  </span>
                  <span className="text-[#20201E] font-medium text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Immediate Action Button */}
            <button
              onClick={handleEnquire}
              className="w-full py-4 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <span>Enquire About {horse.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Horse Comprehensive Description Sections */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Editorial Text */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E] font-normal border-b border-[#B7B0A4]/25 pb-3">
                Overview & Athletic Scope
              </h2>
              <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4 whitespace-pre-line">
                {horse.description}
              </div>
            </div>

            {/* Personality & Stable Manners */}
            {horse.personality && (
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#20201E] font-normal">
                  Temperament & Disposition
                </h3>
                <p className="text-sm text-[#73716B] leading-relaxed font-light whitespace-pre-line">
                  {horse.personality}
                </p>
              </div>
            )}

            {/* Training Progression */}
            {horse.training && (
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#20201E] font-normal">
                  Training & Under-Saddle Development
                </h3>
                <p className="text-sm text-[#73716B] leading-relaxed font-light whitespace-pre-line">
                  {horse.training}
                </p>
              </div>
            )}

            {/* Competition History */}
            {horse.competition_history && (
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#20201E] font-normal">
                  Show & Competition Record
                </h3>
                <p className="text-sm text-[#73716B] leading-relaxed font-light whitespace-pre-line">
                  {horse.competition_history}
                </p>
              </div>
            )}

            {/* Suitability */}
            {horse.suitability && (
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#20201E] font-normal">
                  Rider Partnership & Suitability
                </h3>
                <p className="text-sm text-[#73716B] leading-relaxed font-light whitespace-pre-line">
                  {horse.suitability}
                </p>
              </div>
            )}
          </div>

          {/* Right Side Quality Seals */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#B7B0A4]/35 p-6 space-y-4">
              <div className="flex items-center space-x-2 text-[#24362D]">
                <Shield className="w-4 h-4 text-[#A89472]" />
                <h4 className="font-serif text-lg text-[#20201E]">Veterinary Certification</h4>
              </div>
              <p className="text-xs text-[#73716B] leading-relaxed font-light">
                Complete clinical five-stage vetting and pristine digital radiograph repository available upon request to certified equine veterinarians.
              </p>
            </div>

            <div className="bg-white border border-[#B7B0A4]/35 p-6 space-y-4">
              <div className="flex items-center space-x-2 text-[#24362D]">
                <HeartHandshake className="w-4 h-4 text-[#A89472]" />
                <h4 className="font-serif text-lg text-[#20201E]">Montrose Guarantee</h4>
              </div>
              <p className="text-xs text-[#73716B] leading-relaxed font-light">
                Every sale includes trial schooling at our Normandy facility, complete history documentation, and our open return sanctuary policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pedigree Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <PedigreeTree
          horseName={horse.name}
          sire={horse.sire}
          dam={horse.dam}
          grandSirePaternal={horse.grand_sire_paternal}
          grandDamPaternal={horse.grand_dam_paternal}
          grandSireMaternal={horse.grand_sire_maternal}
          grandDamMaternal={horse.grand_dam_maternal}
        />
      </section>

      {/* Elegant Gallery Section */}
      {images.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-6">
          <div className="border-b border-[#B7B0A4]/30 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
                Visual Documentation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E]">
                Photographic Gallery
              </h2>
            </div>
            <span className="text-xs font-serif italic text-[#73716B]">
              Click any image to enlarge
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div
                key={img.id || i}
                onClick={() => openLightboxAt(i)}
                className="group cursor-pointer aspect-[4/3] overflow-hidden bg-white border border-[#B7B0A4]/35 relative"
              >
                <img
                  src={img.url}
                  alt={img.caption || horse.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-[#20201E]/80 backdrop-blur-xs p-3 text-[11px] text-[#FAF9F6] font-serif italic">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#FFFFFF] border border-[#B7B0A4]/40 p-10 sm:p-16 text-center space-y-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
            Private Acquisition Enquiry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            Interested in {horse.name}?
          </h2>
          <p className="text-xs sm:text-sm text-[#73716B] max-w-xl mx-auto font-light leading-relaxed">
            For additional information, veterinary records, comprehensive private training videos, or to arrange a private viewing in Normandy, please contact our estate directors.
          </p>
          <div className="pt-2">
            <button
              onClick={handleEnquire}
              className="px-8 py-3.5 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors"
            >
              Enquire About {horse.name}
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
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
