import React, { useEffect } from 'react';
import { useEstate } from '../lib/estateContext';

interface TestimonialsPageProps {
  onNavigate: (path: string) => void;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
  const { testimonials, settings } = useEstate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publishedTestimonials = testimonials.filter((t) => t.published);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 animate-in fade-in duration-500 space-y-16">
      
      {/* 1. HEADER */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A89472] font-medium">
          Successful Matches
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#20201E] font-normal leading-tight">
          Testimonials
        </h1>
        <p className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
          Hear from buyers who have found their perfect equine partner through {settings.business_name}. 
          We take pride in building lasting relationships and ensuring both horse and rider thrive.
        </p>
      </section>

      {/* 2. TESTIMONIALS GRID */}
      {publishedTestimonials.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {publishedTestimonials.map((t) => (
            <div key={t.id} className="bg-[#FAF9F6] border border-[#B7B0A4]/30 p-8 sm:p-10 space-y-6 relative flex flex-col h-full hover:border-[#24362D]/40 transition-colors duration-300">
              <span className="absolute top-6 left-6 text-5xl text-[#A89472]/20 font-serif leading-none select-none">
                "
              </span>
              <p className="text-sm sm:text-base text-[#20201E] leading-relaxed font-serif relative z-10 italic flex-grow">
                "{t.testimonial}"
              </p>
              
              <div className="flex items-center space-x-4 pt-6 border-t border-[#B7B0A4]/20 relative z-10 mt-auto">
                {t.image_url ? (
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0 border border-[#B7B0A4]/30">
                    <img src={t.image_url} alt={t.buyer_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[#20201E] text-[#FAF9F6] rounded-full flex items-center justify-center shrink-0 font-serif text-lg">
                    {t.buyer_name.charAt(0)}
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
        </section>
      ) : (
        <div className="text-center py-20 border border-[#B7B0A4]/30 bg-white">
          <p className="text-sm text-[#73716B] font-light">
            No testimonials are currently published. Please check back later.
          </p>
        </div>
      )}

      {/* 3. CTA SECTION */}
      <section className="bg-[#FFFFFF] border border-[#B7B0A4]/40 p-10 sm:p-16 text-center space-y-6 mt-12">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
          Find Your Perfect Match
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] max-w-2xl mx-auto font-normal">
          Ready to start your journey?
        </h2>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/horses')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#24362D] text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1b2922] transition-colors"
          >
            Explore Available Horses
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto px-8 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.2em] hover:bg-[#FAF9F6] transition-colors"
          >
            Buyer Application
          </button>
        </div>
      </section>

    </div>
  );
};
