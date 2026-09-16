import React, { useEffect } from 'react';
import { Heart, ArrowRight, Check } from 'lucide-react';
import { useEstate } from '../lib/estateContext';
import { StatusBadge } from '../components/public/StatusBadge';

interface RescuePageProps {
  onNavigate: (path: string) => void;
}

export const RescuePage: React.FC<RescuePageProps> = ({ onNavigate }) => {
  const { rescues, settings } = useEstate();
  const publishedRescues = rescues.filter((r) => r.published);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-20 sm:space-y-28">
      
      {/* 1. HERO / INTRO */}
      <section className="max-w-4xl space-y-6">
        <div className="flex items-center space-x-2 text-[#A89472]">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">
            Horse Rescue & Second Chances
          </span>
        </div>
        
        <h1 className="font-serif text-4xl sm:text-6xl text-[#20201E] font-normal leading-[1.12]">
          Every Horse Deserves Another Chance.
        </h1>
        
        <div className="text-sm sm:text-base text-[#73716B] leading-relaxed font-light space-y-4">
          <p>
            Our rescue work is driven by a simple belief: horses deserve safety, care, patience, and the opportunity to have a better life.
          </p>
          <p>
            Horse rescue is not a profit-making part of our work. When a horse needs help, our priority is its welfare—not the financial return.
          </p>
        </div>
      </section>

      {/* 2. THE MISSION & A SECOND CHANCE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block">
            Our Mission
          </span>
          <p className="text-sm text-[#73716B] font-light leading-relaxed">
            We help horses that may have been neglected, abandoned, surrendered, displaced, or simply found themselves without a safe home. Whenever possible, we provide them with proper care, rehabilitation, training, and time to recover.
          </p>
          <p className="text-sm text-[#73716B] font-light leading-relaxed">
            We believe a difficult past does not have to define a horse's future.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block">
            A Second Chance
          </span>
          <p className="text-sm text-[#73716B] font-light leading-relaxed">
            Some horses arrive needing more than food and shelter. They may need veterinary attention, rehabilitation, patience, retraining, or simply time to learn to trust people again.
          </p>
          <p className="text-sm text-[#73716B] font-light leading-relaxed">
            Our goal is to give each horse the opportunity to heal, rebuild confidence, and move toward a safe and suitable future home.
          </p>
        </div>
      </section>

      {/* 3. WHAT WE PROVIDE */}
      <section className="bg-white border border-[#B7B0A4]/35 p-8 sm:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block text-center">
            What We Provide
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Safe shelter and daily care",
              "Proper nutrition and fresh water",
              "Veterinary care when needed",
              "Rehabilitation and recovery",
              "Patient handling and retraining",
              "Socialization and confidence building",
              "Careful placement into suitable homes"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-[#FAF9F6] border border-[#B7B0A4]/20">
                <Check className="w-4 h-4 text-[#A89472] mt-0.5 shrink-0" />
                <span className="text-sm text-[#20201E] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RESPONSIBLE REHOMING */}
      <section className="max-w-3xl space-y-4 border-l-4 border-[#A89472] pl-6 py-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A89472] font-semibold block">
          Responsible Rehoming
        </span>
        <p className="text-base sm:text-lg text-[#20201E] font-serif leading-relaxed">
          When a rescued horse is ready for a new home, we take the time to consider whether the home is appropriate for that individual horse. Our goal is not simply to move a horse on—it is to give that horse a lasting second chance.
        </p>
      </section>

      {/* 5. RESCUE HORSES GRID */}
      {publishedRescues.length > 0 && (
        <section className="space-y-8 pt-8 border-t border-[#B7B0A4]/30">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E]">Current Rescues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedRescues.map((horse) => {
              const coverImg = horse.images?.find((img) => img.is_cover) || horse.images?.[0];
              
              return (
                <div 
                  key={horse.id} 
                  onClick={() => onNavigate(`/rescue/${horse.slug}`)}
                  className="group cursor-pointer flex flex-col bg-white border border-[#B7B0A4]/35 overflow-hidden transition-all hover:border-[#24362D]/50 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-[#FAF9F6]">
                    {coverImg ? (
                      <img
                        src={coverImg.url}
                        alt={horse.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#B7B0A4]">
                        <Heart className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <StatusBadge status={horse.status} type="rescue" />
                    </div>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="font-serif text-2xl text-[#20201E]">{horse.name}</h3>
                    </div>
                    <p className="text-sm text-[#73716B] font-light line-clamp-2">
                      {horse.short_description}
                    </p>
                    <div className="mt-auto pt-4 flex items-center text-[10px] uppercase tracking-widest text-[#24362D] font-semibold group-hover:text-[#A89472] transition-colors">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. HELP US */}
      <section className="text-center bg-[#FAF9F6] border border-[#B7B0A4]/40 p-12 space-y-6 mt-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#20201E] font-normal">
          Help Us Give Horses a Second Chance
        </h2>
        <p className="text-sm text-[#73716B] max-w-xl mx-auto font-light leading-relaxed">
          Every rescue takes time, resources, patience, and commitment. Support from people who care about horses helps us continue providing these animals with the care they need.
        </p>
        <p className="text-base text-[#20201E] font-serif italic pb-4">
          Because sometimes, all a horse needs is someone willing to give it another chance.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-8 py-3 bg-[#24362D] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#1b2a22] transition-colors font-medium"
        >
          Learn How to Help
        </button>
      </section>

    </div>
  );
};
