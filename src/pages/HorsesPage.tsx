import React, { useState, useMemo } from 'react';
import { ArrowRight, Filter, RotateCcw } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { StatusBadge } from '../components/public/StatusBadge';
import { HorseSex, HorseStatus } from '../types/database';

interface HorsesPageProps {
  onNavigate: (path: string) => void;
}

export const HorsesPage: React.FC<HorsesPageProps> = ({ onNavigate }) => {
  const { horses } = useEstate();

  // Filter states
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [selectedSex, setSelectedSex] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showSold, setShowSold] = useState<boolean>(true);

  // Extract unique filter options from published horses
  const publishedHorses = useMemo(() => {
    return horses.filter((h) => h.published);
  }, [horses]);

  const breeds = useMemo(() => {
    const set = new Set(publishedHorses.map((h) => h.breed));
    return Array.from(set);
  }, [publishedHorses]);

  const disciplines = useMemo(() => {
    const set = new Set(publishedHorses.map((h) => h.discipline));
    return Array.from(set);
  }, [publishedHorses]);

  // Filtered horses
  const filteredHorses = useMemo(() => {
    return publishedHorses.filter((horse) => {
      if (selectedBreed !== 'all' && horse.breed !== selectedBreed) return false;
      if (selectedSex !== 'all' && horse.sex !== selectedSex) return false;
      if (selectedDiscipline !== 'all' && horse.discipline !== selectedDiscipline) return false;
      if (selectedStatus !== 'all' && horse.status !== selectedStatus) return false;
      if (!showSold && horse.status === 'Sold') return false;
      return true;
    });
  }, [publishedHorses, selectedBreed, selectedSex, selectedDiscipline, selectedStatus, showSold]);

  const resetFilters = () => {
    setSelectedBreed('all');
    setSelectedSex('all');
    setSelectedDiscipline('all');
    setSelectedStatus('all');
    setShowSold(true);
  };

  const hasActiveFilters =
    selectedBreed !== 'all' ||
    selectedSex !== 'all' ||
    selectedDiscipline !== 'all' ||
    selectedStatus !== 'all' ||
    !showSold;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-16">
      {/* Editorial Header */}
      <section className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#A89472] font-semibold">
          Current Inventory
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-tight">
          Available Horses
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#73716B] leading-relaxed font-light">
          Each sport horse offered by Sterling has been bred with intention, nurtured across open pastures, and trained under classical principles. We welcome private viewings and veterinary vetting by appointment.
        </p>
      </section>

      {/* Minimal & Elegant Filter Bar */}
      <section className="bg-white border border-[#B7B0A4]/35 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#B7B0A4]/20 pb-3">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#20201E] font-medium">
            <Filter className="w-3.5 h-3.5 text-[#A89472]" />
            <span>Refine Selection</span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#73716B] hover:text-[#20201E] flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-xs">
          {/* Breed Filter */}
          <div className="space-y-1">
            <label className="block uppercase tracking-wider text-[#73716B] text-[10px]">
              Breed
            </label>
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full py-1.5 px-2 bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
            >
              <option value="all">All Breeds</option>
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sex Filter */}
          <div className="space-y-1">
            <label className="block uppercase tracking-wider text-[#73716B] text-[10px]">
              Sex
            </label>
            <select
              value={selectedSex}
              onChange={(e) => setSelectedSex(e.target.value)}
              className="w-full py-1.5 px-2 bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
            >
              <option value="all">All Sexes</option>
              <option value="Mare">Mare</option>
              <option value="Stallion">Stallion</option>
              <option value="Gelding">Gelding</option>
              <option value="Colt">Colt</option>
              <option value="Filly">Filly</option>
            </select>
          </div>

          {/* Discipline Filter */}
          <div className="space-y-1">
            <label className="block uppercase tracking-wider text-[#73716B] text-[10px]">
              Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full py-1.5 px-2 bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
            >
              <option value="all">All Disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status Filter */}
          <div className="space-y-1">
            <label className="block uppercase tracking-wider text-[#73716B] text-[10px]">
              Availability
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2 bg-[#FAF9F6] border border-[#B7B0A4]/40 text-[#20201E] focus:outline-none focus:border-[#24362D]"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Not Currently Available">Not Currently Available</option>
            </select>
          </div>

          {/* Sold Toggle */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer pb-2 text-[11px] text-[#73716B]">
              <input
                type="checkbox"
                checked={showSold}
                onChange={(e) => setShowSold(e.target.checked)}
                className="accent-[#24362D] rounded-none"
              />
              <span>Include Archive/Sold</span>
            </label>
          </div>
        </div>
      </section>

      {/* Horse Cards Grid */}
      {filteredHorses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {filteredHorses.map((horse) => {
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
                {/* Large Photograph */}
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

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E] mt-1 font-normal group-hover:text-[#24362D] transition-colors">
                      {horse.name}
                    </h2>

                    <p className="text-xs text-[#A89472] mt-0.5 tracking-wider uppercase font-sans">
                      {horse.sex} · {horse.age ? `${horse.age} Years` : 'Age on record'} · {horse.height || 'Height on record'}
                    </p>

                    <p className="mt-3 text-xs text-[#73716B] leading-relaxed line-clamp-2 font-light">
                      {horse.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#B7B0A4]/20 flex items-center justify-between">
                    <span className="text-xs font-serif italic text-[#73716B]">
                      {horse.price
                        ? `${horse.currency || 'EUR'} ${(horse.price).toLocaleString()}`
                        : 'Price on Private Application'}
                    </span>
                    <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-[#20201E] font-medium group-hover:translate-x-0.5 transition-transform">
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3 ml-1.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#B7B0A4]/35 p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl text-[#20201E]">
            New arrivals are coming soon.
          </h3>
          <p className="text-xs sm:text-sm text-[#73716B] font-light leading-relaxed">
            We do not have horses matching your exact filter criteria right now. Please contact our estate concierge for upcoming youngsters and private offline enquiries.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#24362D] text-white text-xs uppercase tracking-wider hover:bg-[#1c2922] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
