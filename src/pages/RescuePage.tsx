import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { StatusBadge } from '../components/public/StatusBadge';

interface RescuePageProps {
  onNavigate: (path: string) => void;
}

export const RescuePage: React.FC<RescuePageProps> = ({ onNavigate }) => {
  const { rescues } = useEstate();
  const publishedRescues = rescues.filter((r) => r.published);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-20 sm:space-y-28">
      {/* 1. EDITORIAL INTRO */}
      <section className="max-w-4xl space-y-6">
        <div className="flex items-center space-x-2 text-[#A89472]">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">
            Equine Sanctuary & Welfare
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-[1.12]">
          The Sanctuary at Montrose: Dignity restored with patience and quiet affection.
        </h1>
        <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4">
          <p>
            While our breeding program pursues high athletic precision, our sanctuary exists to honour the vulnerability inherent in every equine life. Over forty years, Montrose has opened its paddocks to sport horses cast aside through injury, neglect, or commercial abandonment.
          </p>
          <p>
            We operate this work entirely through our own resources—without public charity solicitations or commercial fanfare. For horses capable of thriving in companion or light pleasure partnerships, we search meticulously for permanent, loving homes. For those whose bodies or minds require peace, Montrose remains their forever home.
          </p>
        </div>
      </section>

      {/* 2. SANCTUARY PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white border border-[#B7B0A4]/35 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
            Principle 01
          </span>
          <h3 className="font-serif text-2xl text-[#20201E]">Unconditional Time</h3>
          <p className="text-xs text-[#73716B] leading-relaxed font-light">
            Trauma cannot be rushed. We give distressed horses months of pasture liberty and gentle handling before asking anything of them.
          </p>
        </div>

        <div className="p-8 bg-white border border-[#B7B0A4]/35 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
            Principle 02
          </span>
          <h3 className="font-serif text-2xl text-[#20201E]">Advanced Veterinary Care</h3>
          <p className="text-xs text-[#73716B] leading-relaxed font-light">
            Each rescue receives the same world-class orthopedic, dental, and nutritional care as our premier competition athletes.
          </p>
        </div>

        <div className="p-8 bg-white border border-[#B7B0A4]/35 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-semibold">
            Principle 03
          </span>
          <h3 className="font-serif text-2xl text-[#20201E]">Lifelong Guarantee</h3>
          <p className="text-xs text-[#73716B] leading-relaxed font-light">
            Every rehomed sanctuary horse is bound by our perpetual covenant: they can never be sold at public auction and may return at any time.
          </p>
        </div>
      </section>

      {/* 3. RESCUE STORIES GRID */}
      <section className="space-y-12">
        <div className="border-b border-[#B7B0A4]/30 pb-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201E] font-normal">
            Restored Lives & Stories
          </h2>
          <p className="text-xs text-[#73716B] mt-1 font-light">
            Journeys of rehabilitation, resilience, and newfound peace at Montrose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {publishedRescues.map((rescue) => {
            const coverImage =
              rescue.images?.[0]?.url ||
              '/images/rescue.jpg';

            return (
              <article
                key={rescue.id}
                onClick={() => onNavigate(`/rescue/${rescue.slug}`)}
                className="group cursor-pointer flex flex-col bg-white border border-[#B7B0A4]/35 hover:border-[#20201E] transition-all duration-300"
              >
                {/* Photo */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF9F6] relative">
                  <img
                    src={coverImage}
                    alt={rescue.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={rescue.status} />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89472] font-medium">
                      Rescued {rescue.rescue_date}
                    </span>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#20201E] mt-1 font-normal group-hover:text-[#24362D] transition-colors">
                      {rescue.name}
                    </h3>

                    <p className="mt-3 text-xs text-[#73716B] leading-relaxed line-clamp-3 font-light">
                      {rescue.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#B7B0A4]/20 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-[#73716B]">
                      {rescue.location || 'Montrose Sanctuary'}
                    </span>
                    <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-[#20201E] font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SANCTUARY CONTACT CTA */}
      <section className="bg-[#FAF9F6] border border-[#B7B0A4]/40 p-10 sm:p-16 text-center space-y-6">
        <h2 className="font-serif text-3xl text-[#20201E] font-normal">
          Inquire About Rehoming or Sanctuary Partnerships
        </h2>
        <p className="text-xs sm:text-sm text-[#73716B] max-w-xl mx-auto font-light leading-relaxed">
          If you have the acreage, experience, and commitment to offer an approved forever home to one of our rehabilitated horses, we invite you to begin a dialogue with our welfare custodian.
        </p>
        <div>
          <button
            onClick={() => onNavigate('/contact?subject=Sanctuary%20Enquiry')}
            className="px-8 py-3.5 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1a2820] transition-colors"
          >
            Contact the Sanctuary Custodian
          </button>
        </div>
      </section>
    </div>
  );
};
