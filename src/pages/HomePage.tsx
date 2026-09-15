import React from 'react';
import { ArrowRight, Compass, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { StatusBadge } from '../components/public/StatusBadge';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { horses, rescues, journal, settings } = useEstate();

  // Filter published horses for featured section
  const featuredHorses = horses
    .filter((h) => h.published && (h.featured || h.status === 'Available'))
    .slice(0, 3);

  const featuredRescue = rescues.find((r) => r.published && r.featured) || rescues[0];
  const featuredArticles = journal.filter((p) => p.published).slice(0, 2);

  return (
    <div className="space-y-24 sm:space-y-32 lg:space-y-40 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#20201E]">
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Warmblood in the misty morning pasture at Sterling Estate"
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#20201E] via-[#20201E]/40 to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center text-[#FAF9F6] pt-16 pb-12">
          {/* Eyebrow */}
          <span className="inline-block text-[11px] sm:text-xs font-sans tracking-[0.35em] text-[#B7B0A4] uppercase mb-4">
            EST. 1984 · PAYS D'AUGE, NORMANDY
          </span>

          {/* Large Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Exceptional Horses.
            <br />
            <span className="italic font-light">Thoughtfully Bred.</span>
          </h1>

          {/* Short Supporting Copy */}
          <p className="mt-6 sm:mt-8 font-sans text-base sm:text-lg text-[#FAF9F6]/90 max-w-2xl mx-auto font-light leading-relaxed">
            A private estate dedicated to classical French lineages, athletic longevity, and the respectful stewardship of every equine life.
          </p>

          {/* CTAs */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => onNavigate('/horses')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF9F6] text-[#20201E] text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-all shadow-lg"
              id="hero-view-horses-btn"
            >
              View Our Horses
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#FAF9F6]/60 text-[#FAF9F6] text-xs uppercase tracking-[0.2em] hover:border-white hover:bg-white/10 transition-all"
              id="hero-story-btn"
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION (Asymmetric Editorial Layout) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
              The Breeding Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] leading-tight font-normal">
              Breeding with purpose,
              <br />
              <span className="italic">patience, and reverence.</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
              <p>
                At Sterling, we reject commercial haste. True excellence in equine breeding cannot be manufactured in a single season. It requires generational patience, an unwavering dedication to damline integrity, and an intimate understanding of biomechanical soundness.
              </p>
              <p>
                Our horses are raised naturally in large herd environments across 180 hectares of fertile Normandy pastureland. From their first days, they develop spatial balance, unshakeable confidence, and profound trust in human stewardship.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('/about')}
                className="group inline-flex items-center text-xs uppercase tracking-[0.2em] text-[#24362D] font-medium border-b border-[#24362D] pb-1 hover:text-[#16221c]"
              >
                <span>Discover Our Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] overflow-hidden bg-[#FAF9F6] border border-[#B7B0A4]/30 shadow-sm">
              <img
                src="/images/about.jpg"
                alt="Sterling training in the classical arena"
                className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Small Overlay Quote Card */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 bg-[#FAF9F6] border border-[#B7B0A4]/40 p-6 max-w-xs shadow-md">
              <p className="font-serif italic text-sm text-[#20201E] leading-relaxed">
                "A horse trained with clarity and kindness will always offer more than one asked with force."
              </p>
              <span className="block text-[9px] uppercase tracking-widest text-[#73716B] mt-2">
                — Henri Sterling
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRENTLY AVAILABLE HORSES */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-[#B7B0A4]/30 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] mt-1 font-normal">
              Currently Available
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#73716B] font-light max-w-md mt-4 md:mt-0">
            Selected Warmblood sport horses prepared under classical discipline for private sale and competition partnership.
          </p>
        </div>

        {/* Large Editorial Horse Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {featuredHorses.map((horse) => {
            const coverImage =
              horse.images?.find((img) => img.is_cover)?.url ||
              horse.images?.[0]?.url ||
              '/images/dressage.jpg';

            return (
              <article
                key={horse.id}
                onClick={() => onNavigate(`/horses/${horse.slug}`)}
                className="group cursor-pointer flex flex-col bg-white border border-[#B7B0A4]/35 hover:border-[#20201E] transition-all duration-300"
              >
                {/* Large Editorial Photograph */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#FAF9F6] relative">
                  <img
                    src={coverImage}
                    alt={horse.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={horse.status} />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#73716B]">
                      <span>{horse.breed}</span>
                      <span>{horse.discipline}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#20201E] mt-1 font-normal group-hover:text-[#24362D] transition-colors">
                      {horse.name}
                    </h3>

                    <p className="text-xs text-[#A89472] mt-0.5 tracking-wider uppercase font-sans">
                      {horse.sex} · {horse.age ? `${horse.age} Years` : 'Age on record'} · {horse.height || 'Height on record'}
                    </p>

                    <p className="mt-3 text-xs text-[#73716B] leading-relaxed line-clamp-2 font-light">
                      {horse.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#B7B0A4]/20 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-[#73716B]">
                      {horse.location || 'Normandy Estate'}
                    </span>
                    <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-[#20201E] font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>View Horse</span>
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Horses Bottom Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => onNavigate('/horses')}
            className="px-10 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.2em] hover:bg-[#20201E] hover:text-[#FAF9F6] transition-all duration-300 font-medium"
          >
            View All Horses
          </button>
        </div>
      </section>

      {/* 4. DEDICATED RESCUE & SANCTUARY SECTION */}
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
                    The Sanctuary Wing
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] leading-tight font-normal">
                  Every Horse Deserves a Future.
                </h2>

                <p className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
                  Alongside our competitive breeding program, Sterling sustains a 40-hectare rehabilitation haven. Here, vulnerable, injured, or surrendered horses receive comprehensive medical restoration, tailored nutrition, and lifelong sanctuary.
                </p>

                {/* Featured Rescue Highlight */}
                <div className="p-5 bg-white border border-[#B7B0A4]/35 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl text-[#20201E]">
                      Story Highlight: {featuredRescue.name}
                    </h3>
                    <StatusBadge status={featuredRescue.status} />
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
                    Explore The Sanctuary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. JOURNAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#B7B0A4]/30 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold block">
              Writings & Reflections
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] mt-1 font-normal">
              The Estate Journal
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/journal')}
            className="text-xs uppercase tracking-[0.18em] text-[#24362D] font-medium hover:underline mt-4 md:mt-0"
          >
            All Journal Entries →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate(`/journal/${article.slug}`)}
              className="group cursor-pointer space-y-4"
            >
              <div className="aspect-[16/10] overflow-hidden bg-white border border-[#B7B0A4]/30">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-[11px] text-[#73716B] uppercase tracking-wider">
                  <span className="text-[#A89472] font-medium">{article.category}</span>
                  <span>·</span>
                  <span>{article.author}</span>
                </div>

                <h3 className="font-serif text-2xl text-[#20201E] group-hover:text-[#24362D] transition-colors font-normal leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-[#73716B] leading-relaxed line-clamp-2 font-light">
                  {article.excerpt}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-[#20201E] font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. CONTACT CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#FFFFFF] border border-[#B7B0A4]/40 p-10 sm:p-16 lg:p-20 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
            Private Viewings & Consultations
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#20201E] max-w-2xl mx-auto font-normal">
            Begin a conversation with our estate directors.
          </h2>

          <p className="text-sm sm:text-base text-[#73716B] max-w-xl mx-auto font-light leading-relaxed">
            For further details, comprehensive veterinary dossiers, additional private footage, or to arrange an unhurried estate viewing in Normandy, please reach out to our concierge.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#24362D] text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1b2922] transition-colors"
            >
              Contact The Breeder
            </button>
            <button
              onClick={() => onNavigate('/horses')}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#20201E] text-[#20201E] text-xs uppercase tracking-[0.2em] hover:bg-[#FAF9F6] transition-colors"
            >
              Explore Horses For Sale
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
