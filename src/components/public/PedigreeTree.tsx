import React from 'react';

interface PedigreeTreeProps {
  horseName: string;
  sire?: string | null;
  dam?: string | null;
  grandSirePaternal?: string | null;
  grandDamPaternal?: string | null;
  grandSireMaternal?: string | null;
  grandDamMaternal?: string | null;
}

export const PedigreeTree: React.FC<PedigreeTreeProps> = ({
  horseName,
  sire,
  dam,
  grandSirePaternal,
  grandDamPaternal,
  grandSireMaternal,
  grandDamMaternal,
}) => {
  if (!sire && !dam) return null;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#B7B0A4]/35 p-6 sm:p-8 rounded-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#B7B0A4]/25">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A89472] font-medium block">
            Studbook Record
          </span>
          <h3 className="font-serif text-2xl text-[#20201E] mt-0.5">
            Pedigree & Generational Lineage
          </h3>
        </div>
        <span className="text-xs font-serif italic text-[#73716B] hidden sm:inline">
          Official Lineage Chart
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-center">
        {/* Generation 1: Subject Horse */}
        <div className="p-4 bg-[#FAF9F6] border border-[#B7B0A4]/40 flex flex-col justify-center min-h-[140px]">
          <span className="text-[10px] uppercase tracking-wider text-[#73716B]">Subject</span>
          <span className="font-serif text-xl sm:text-2xl text-[#20201E] font-medium mt-1">
            {horseName}
          </span>
          <span className="text-xs text-[#A89472] mt-0.5">Sterling Breeding</span>
        </div>

        {/* Generation 2: Sire & Dam */}
        <div className="space-y-4">
          {/* Sire */}
          <div className="p-3.5 bg-[#FAF9F6] border-l-2 border-l-[#24362D] border border-[#B7B0A4]/30">
            <span className="text-[9px] uppercase tracking-wider text-[#73716B] block">Sire (Father)</span>
            <span className="font-serif text-lg text-[#20201E] font-normal block mt-0.5">
              {sire || 'Unrecorded Sire'}
            </span>
          </div>

          {/* Dam */}
          <div className="p-3.5 bg-[#FAF9F6] border-l-2 border-l-[#A89472] border border-[#B7B0A4]/30">
            <span className="text-[9px] uppercase tracking-wider text-[#73716B] block">Dam (Mother)</span>
            <span className="font-serif text-lg text-[#20201E] font-normal block mt-0.5">
              {dam || 'Unrecorded Dam'}
            </span>
          </div>
        </div>

        {/* Generation 3: Grandparents */}
        <div className="space-y-2 text-xs">
          {/* Paternal Grandparents */}
          <div className="p-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/25">
            <span className="text-[8px] uppercase tracking-widest text-[#73716B] block">Grand Sire (Paternal)</span>
            <span className="font-serif text-sm text-[#20201E] font-medium">
              {grandSirePaternal || 'Not recorded'}
            </span>
          </div>
          <div className="p-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/25">
            <span className="text-[8px] uppercase tracking-widest text-[#73716B] block">Grand Dam (Paternal)</span>
            <span className="font-serif text-sm text-[#20201E]">
              {grandDamPaternal || 'Not recorded'}
            </span>
          </div>

          {/* Maternal Grandparents */}
          <div className="p-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/25">
            <span className="text-[8px] uppercase tracking-widest text-[#73716B] block">Grand Sire (Maternal)</span>
            <span className="font-serif text-sm text-[#20201E] font-medium">
              {grandSireMaternal || 'Not recorded'}
            </span>
          </div>
          <div className="p-2.5 bg-[#FAF9F6] border border-[#B7B0A4]/25">
            <span className="text-[8px] uppercase tracking-widest text-[#73716B] block">Grand Dam (Maternal)</span>
            <span className="font-serif text-sm text-[#20201E]">
              {grandDamMaternal || 'Not recorded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
