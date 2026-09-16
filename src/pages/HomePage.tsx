import React, { useEffect } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { StatusBadge } from '../components/public/StatusBadge';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings, horses, rescues, testimonials } = useEstate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredHorses = horses
    .filter((h) => h.published && h.featured && h.status !== 'Sold')
    .slice(0, 3);
    
  const featuredRescue = rescues.find((r) => r.published && r.featured);
  
  return (
        <div className="pt-24 pb-20 space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/5] lg:aspect-square w-full overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/35 shadow-sm">
              <img
                src={settings.about_image_1 || "/images/hero.jpg"}
                alt="Sterling Horse Sale Houston Texas"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
              {settings.business_name}
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#20201E] font-normal leading-[1.1] tracking-tight">
              Find the Horse That Fits Your Life.
            </h1>
            
            <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4 pt-4">
              <p>
                Based in Houston, Texas, {settings.business_name} is dedicated to connecting buyers with quality horses while providing a professional, transparent, and straightforward purchasing experience.
              </p>
              <p>
                We believe finding the right horse starts with understanding both the horse and the buyer. Our approach is centered on responsible horse handling, accurate information, and helping each buyer find a horse that fits their experience, goals, and lifestyle.
              </p>
            </div>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={() => onNavigate('/horses')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#24362D] text-white text-xs uppercase tracking-[0.18em] hover:bg-[#1b2a22] transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>View Available Horses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className="w-full sm:w-auto px-8 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.18em] hover:bg-[#FAF9F6] transition-colors font-medium text-center"
              >
                About Us
              </button>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. FEATURED HORSES FOR SALE */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#B7B0A4]/30 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] mt-1 font-normal">
              Featured Horses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/horses')}
            className="text-xs uppercase tracking-[0.18em] text-[#24362D] font-medium hover:underline mt-4 md:mt-0"
          >
            Explore Collection →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {featuredHorses.map((horse) => {
            const coverImg = horse.images?.find((img) => img.is_cover) || horse.images?.[0];
            
            return (
              <article
                key={horse.id}
                onClick={() => onNavigate(`/horse/${horse.slug}`)}
                className="group cursor-pointer flex flex-col bg-white border border-[#B7B0A4]/35 overflow-hidden hover:border-[#24362D]/50 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-[#FAF9F6]">
                  {coverImg ? (
                    <img
                      src={coverImg.url}
                      alt={horse.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#B7B0A4]/50">
                      No Photo
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={horse.status} />
                  </div>
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-2xl text-[#20201E]">{horse.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-[#A89472] mt-1 font-semibold">
                        {horse.breed}
                      </p>
                    </div>
                    {horse.price && (
                      <p className="font-mono text-sm text-[#20201E] tracking-tight whitespace-nowrap bg-[#FAF9F6] px-2 py-1 border border-[#B7B0A4]/30">
                        {horse.currency || '$'}{horse.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[#73716B] uppercase tracking-wider border-t border-b border-[#B7B0A4]/20 py-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#A89472]">Age</span>
                      <span className="font-medium text-[#20201E]">{horse.age ? `${horse.age} Years` : 'TBD'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#A89472]">Height</span>
                      <span className="font-medium text-[#20201E]">{horse.height || 'TBD'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#A89472]">Sex</span>
                      <span className="font-medium text-[#20201E]">{horse.sex}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-[#A89472]">Discipline</span>
                      <span className="font-medium text-[#20201E] truncate" title={horse.discipline}>{horse.discipline}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2">
                    <span className="inline-flex items-center text-[10px] uppercase tracking-[0.15em] text-[#24362D] font-bold group-hover:text-[#A89472] transition-colors">
                      <span>View Horse</span>
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. DEDICATED RESCUE & SANCTUARY SECTION */}
      {featuredRescue && (
        <section className="bg-[#FAF9F6] border-y border-[#B7B0A4]/30 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Image */}
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="aspect-[4/3] overflow-hidden border border-[#B7B0A4]/40 bg-white shadow-sm">
                  <img
                    src={
                      featuredRescue.images?.[0]?.url ||
                      '/images/rescue.jpg'
                    }
                    alt={featuredRescue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right Content */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-[#A89472]" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
                    Horse Rescue & Second Chances
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] leading-tight font-normal">
                  Every Horse Deserves Another Chance.
                </h2>
                
                <p className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
                  Our rescue work is driven by a simple belief: horses deserve safety, care, patience, and the opportunity to have a better life.
                </p>
                
                {/* Featured Rescue Highlight */}
                <div className="p-5 bg-white border border-[#B7B0A4]/35 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#20201E]">
                      Story Highlight: {featuredRescue.name}
                    </h3>
                    <StatusBadge status={featuredRescue.status} type="rescue" />
                  </div>
                  <p className="text-xs text-[#73716B] leading-relaxed font-light">
                    {featuredRescue.short_description}
                  </p>
                </div>
                
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate(`/rescue/${featuredRescue.slug}`)}
                    className="px-6 py-3 bg-[#24362D] text-white text-xs uppercase tracking-[0.18em] hover:bg-[#1b2a22] transition-colors"
                  >
                    Read {featuredRescue.name}'s Story
                  </button>
                  <button
                    onClick={() => onNavigate('/rescue')}
                    className="px-6 py-3 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.18em] hover:bg-[#20201E] hover:text-[#FAF9F6] transition-colors"
                  >
                    Learn About Our Rescues
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* 4. SUCCESS STORIES */}
      {testimonials && testimonials.filter(t => t.published).length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
              Testimonials
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] mt-1 font-normal">
              Successful Matches
            </h2>
            <p className="text-sm text-[#73716B] leading-relaxed font-light">
              Hear from buyers who have found their perfect equine partner through Sterling Horse Sale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {testimonials.filter(t => t.published).map((t) => (
              <div key={t.id} className="bg-[#FAF9F6] border border-[#B7B0A4]/30 p-8 sm:p-12 space-y-6 relative">
                <span className="absolute top-8 left-8 text-6xl text-[#A89472]/20 font-serif leading-none select-none">"</span>
                <p className="text-sm sm:text-base text-[#20201E] leading-relaxed font-serif relative z-10 italic">
                  "{t.testimonial}"
                </p>
                <div className="flex items-center space-x-4 pt-4 border-t border-[#B7B0A4]/20 relative z-10">
                  {t.image_url && (
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 border border-[#B7B0A4]/30">
                      <img src={t.image_url} alt={t.buyer_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif text-lg text-[#20201E]">{t.buyer_name}</h4>
                    <p className="text-[10px] uppercase tracking-wider text-[#73716B]">
                      Matched with "{t.horse_name}" {t.location ? `· ${t.location}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. CONTACT CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#FFFFFF] border border-[#B7B0A4]/40 p-10 sm:p-16 lg:p-20 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
            Ready to find your match?
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] max-w-2xl mx-auto font-normal">
            Start the conversation today.
          </h2>
          <p className="text-sm sm:text-base text-[#73716B] max-w-xl mx-auto font-light leading-relaxed">
            Fill out our Buyer Application to let us know what you are looking for, or browse our current selection of available horses.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#24362D] text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1b2922] transition-colors"
            >
              Buyer Application
            </button>
            <button
              onClick={() => onNavigate('/horses')}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.2em] hover:bg-[#FAF9F6] transition-colors"
            >
              Explore Horses
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
